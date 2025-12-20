/**
 * tRPC Usage Examples
 * How to use the tRPC API in your React components
 */

"use client";

import { trpc } from "./trpc";

// ============================================
// EXAMPLE 1: Fetching Data (Query)
// ============================================

export function ProductsList() {
  // Fetch all products with automatic loading/error states
  const { data, isLoading, error } = trpc.products.getAll.useQuery({
    limit: 20,
    offset: 0,
    search: "headphones", // optional
  });

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.products.map((product) => (
        <div key={product.id}>
          {product.name} - ${product.currentPrice.toString()}
        </div>
      ))}
      {data?.hasMore && <button>Load More</button>}
    </div>
  );
}

// ============================================
// EXAMPLE 2: Creating Data (Mutation)
// ============================================

export function CreateProductForm() {
  const utils = trpc.useUtils();

  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch products list
      utils.products.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createProduct.mutate({
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
      currentPrice: parseFloat(formData.get("price") as string),
      costPrice: parseFloat(formData.get("cost") as string),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="sku" placeholder="SKU" />
      <input name="name" placeholder="Product Name" />
      <input name="price" type="number" placeholder="Price" />
      <input name="cost" type="number" placeholder="Cost" />
      <button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? "Creating..." : "Create Product"}
      </button>
      {createProduct.error && <div>Error: {createProduct.error.message}</div>}
    </form>
  );
}

// ============================================
// EXAMPLE 3: Dashboard Overview
// ============================================

export function DashboardOverview() {
  const { data: overview } = trpc.analytics.getOverview.useQuery();

  return (
    <div className="grid grid-cols-4 gap-4">
      <div>
        <h3>Products</h3>
        <p>{overview?.products}</p>
      </div>
      <div>
        <h3>Revenue (30d)</h3>
        <p>${overview?.totalRevenue.toString()}</p>
      </div>
      <div>
        <h3>Active Recommendations</h3>
        <p>{overview?.activeRecommendations}</p>
      </div>
      <div>
        <h3>Avg Margin</h3>
        <p>{overview?.avgMargin.toString()}%</p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Recommendations with Actions
// ============================================

export function RecommendationsList() {
  const utils = trpc.useUtils();
  const { data } = trpc.recommendations.getAll.useQuery({
    status: "PENDING",
  });

  const updateStatus = trpc.recommendations.updateStatus.useMutation({
    onSuccess: () => {
      utils.recommendations.getAll.invalidate();
      utils.products.getAll.invalidate();
    },
  });

  return (
    <div>
      {data?.recommendations.map((rec) => (
        <div key={rec.id}>
          <h4>{rec.product.name}</h4>
          <p>
            ${rec.currentPrice.toString()} → ${rec.recommendedPrice.toString()}
          </p>
          <p>{rec.reasoning}</p>
          <button
            onClick={() =>
              updateStatus.mutate({ id: rec.id, status: "ACCEPTED" })
            }
          >
            Accept
          </button>
          <button
            onClick={() =>
              updateStatus.mutate({ id: rec.id, status: "REJECTED" })
            }
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXAMPLE 5: Simulations
// ============================================

export function SimulationForm() {
  const utils = trpc.useUtils();
  const createSimulation = trpc.simulations.create.useMutation({
    onSuccess: (simulation) => {
      // Automatically run the simulation
      runSimulation.mutate({ id: simulation.id });
    },
  });

  const runSimulation = trpc.simulations.run.useMutation({
    onSuccess: () => {
      utils.simulations.getAll.invalidate();
    },
  });

  return (
    <button
      onClick={() =>
        createSimulation.mutate({
          name: "Q1 2024 Pricing Test",
          description: "Test 10% increase",
          duration: 30,
          items: [
            {
              productId: "product-id-here",
              proposedPrice: 329.99,
            },
          ],
        })
      }
    >
      Create & Run Simulation
    </button>
  );
}

// ============================================
// AVAILABLE ENDPOINTS
// ============================================

/*
Products:
  - products.getAll({ limit, offset, category?, search? })
  - products.getById({ id })
  - products.create({ sku, name, currentPrice, costPrice, ... })
  - products.update({ id, name?, currentPrice?, ... })
  - products.delete({ id })
  - products.getAnalytics({ id })

Recommendations:
  - recommendations.getAll({ status?, priority?, limit, offset })
  - recommendations.getById({ id })
  - recommendations.updateStatus({ id, status })
  - recommendations.getSummary()

Simulations:
  - simulations.getAll({ status?, limit, offset })
  - simulations.getById({ id })
  - simulations.create({ name, description, duration, items })
  - simulations.run({ id })
  - simulations.delete({ id })

Analytics:
  - analytics.getOverview()
  - analytics.getRevenueTrend({ days })
  - analytics.getInsights({ limit })
  - analytics.getCategoryPerformance()
  - analytics.getRecentActivity({ limit })
*/

