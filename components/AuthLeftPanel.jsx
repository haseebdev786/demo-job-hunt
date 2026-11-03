export default function AuthLeftPanel() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
        alt="Professional man in a suit"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Soft overlay so the white text stays readable */}
      <div className="absolute inset-0 bg-slate-900/10" />

      {/* Logo, top left */}
      <div className="absolute left-8 top-8 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
          J
        </span>
        <span className="text-lg font-black tracking-tight text-white drop-shadow">
          JobHuntly
        </span>
      </div>

      <div className="absolute bottom-8 left-8 right-8 bg-white p-6 shadow-lg">
        <p className="text-xl font-bold text-slate-800">Find your next opportunity</p>
        <p className="mt-2 text-sm text-slate-500">Connect with companies and explore new roles.</p>
      </div>
    </div>
  );
}
