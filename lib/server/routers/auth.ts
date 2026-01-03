/**
 * Authentication Router
 * Handles user signup, login, logout, and session management
 */

import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  createAuthCookie,
  clearAuthCookie,
} from "../auth";

export const authRouter = router({
  // Sign up new user
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        name: z.string().min(1, "Name is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user already exists
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        const error = new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
        // Add custom data to identify the error type
        (error as any).cause = { field: "email", type: "EMAIL_EXISTS" };
        throw error;
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          passwordHash,
          role: "USER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user,
        token,
      };
    }),

  // Login existing user
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find user by email
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        const error = new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
        // Add custom data to identify the error type
        (error as any).cause = { field: "email", type: "EMAIL_NOT_FOUND" };
        throw error;
      }

      // Verify password
      const isValidPassword = await verifyPassword(
        input.password,
        user.passwordHash
      );

      if (!isValidPassword) {
        const error = new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
        // Add custom data to identify the error type
        (error as any).cause = { field: "password", type: "INVALID_PASSWORD" };
        throw error;
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      };
    }),

  // Logout user
  logout: publicProcedure.mutation(() => {
    return {
      success: true,
    };
  }),

  // Get current user
  me: protectedProcedure.query(async ({ ctx }) => {
      // Fetch user with all fields (including avatarUrl which exists in DB)
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Return only the fields we want (avatarUrl is included from the full fetch)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: (user as any).avatarUrl || null,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").optional(),
        email: z.string().email("Invalid email address").optional(),
        avatarUrl: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If email is being changed, check if it's already taken
      if (input.email && input.email !== ctx.user.email) {
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This email is already in use",
          });
        }
      }

      // Update user (avatarUrl is included in input if provided)
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input as any,
      });

      // Return only the fields we want
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatarUrl: (updatedUser as any).avatarUrl || null,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };
    }),

  // Upload avatar
  uploadAvatar: protectedProcedure
    .input(
      z.object({
        fileData: z.string(), // Base64 encoded image
        filename: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        const fileExt = input.filename.split(".").pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          webp: "image/webp",
        };

        const mimeType = fileExt ? mimeTypes[fileExt] : null;
        if (!mimeType || !validTypes.includes(mimeType)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.",
          });
        }

        // Validate file size (2MB max)
        const buffer = Buffer.from(input.fileData, "base64");
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (buffer.length > maxSize) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File size exceeds 2MB limit",
          });
        }

        // Create data URL
        const dataUrl = `data:${mimeType};base64,${input.fileData}`;

        // Update user avatar
        const updatedUser = await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { avatarUrl: dataUrl } as any,
        });

        return { avatarUrl: (updatedUser as any).avatarUrl || dataUrl };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to upload avatar",
        });
      }
    }),

  // Change password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(8, "New password must be at least 8 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user with password hash
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await verifyPassword(
        input.currentPassword,
        user.passwordHash
      );

      if (!isValidPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(input.newPassword);

      // Update password
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { passwordHash: newPasswordHash },
      });

      return { success: true };
    }),
});

