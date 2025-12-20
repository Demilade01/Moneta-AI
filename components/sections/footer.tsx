export function Footer() {
  return (
    <footer className="relative py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo */}
            <div className="text-xl font-semibold text-white">Moneta AI</div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <a
                href="#privacy"
                className="transition-colors hover:text-white"
              >
                Privacy
              </a>
              <a
                href="#terms"
                className="transition-colors hover:text-white"
              >
                Terms
              </a>
              <a
                href="#contact"
                className="transition-colors hover:text-white"
              >
                Contact
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">© Moneta AI</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

