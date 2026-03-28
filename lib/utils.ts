export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateOrderRef(): string {
  return 'CB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase()
}

export function islandLabel(island: string): string {
  const labels: Record<string, string> = {
    'guadeloupe': 'Guadeloupe',
    'martinique': 'Martinique',
    'marie-galante': 'Marie-Galante',
    'les-saintes': 'Les Saintes',
    'metropole': 'Métropole',
  }
  return labels[island] || island
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'musique': '🎵 Musique',
    'culture': '🎭 Culture',
    'gastronomie': '🍽️ Gastronomie',
    'carnaval': '🎉 Carnaval',
    'sport': '⚽ Sport',
    'arts': '🎨 Arts',
  }
  return labels[category] || category
}
