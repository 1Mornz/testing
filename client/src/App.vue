<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/">QuoteGate</RouterLink>
      <nav>
        <RouterLink to="/setup">Setup</RouterLink>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>
