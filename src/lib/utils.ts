export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
  return formatCurrency(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
  return past.toLocaleDateString('pt-BR');
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export const CATEGORIES = [
  { value: 'food_beverage', label: 'Alimentação', icon: 'Coffee' },
  { value: 'technology', label: 'Tecnologia', icon: 'Briefcase' },
  { value: 'healthcare', label: 'Saúde', icon: 'Heart' },
  { value: 'education', label: 'Educação', icon: 'GraduationCap' },
  { value: 'fashion', label: 'Moda', icon: 'Shirt' },
  { value: 'retail', label: 'Varejo', icon: 'ShoppingBag' },
  { value: 'services', label: 'Serviços', icon: 'Wrench' },
  { value: 'real_estate', label: 'Imobiliário', icon: 'Building2' },
  { value: 'agriculture', label: 'Agronegócio', icon: 'Leaf' },
  { value: 'entertainment', label: 'Entretenimento', icon: 'Film' },
  { value: 'finance', label: 'Finanças', icon: 'Landmark' },
  { value: 'logistics', label: 'Logística', icon: 'Truck' },
];

export const INVESTOR_TYPES = [
  { value: 'angel', label: 'Investidor-Anjo', color: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700' },
  { value: 'fund', label: 'Fundo de Investimento', color: 'from-emerald-500 to-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  { value: 'shark_talent_scout', label: 'Olheiro Shark Tank', color: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-700' },
  { value: 'international', label: 'Investidor Internacional', color: 'from-sky-500 to-cyan-600', badge: 'bg-sky-100 text-sky-700' },
];

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label || value;
}

export function getInvestorTypeLabel(value: string): string {
  return INVESTOR_TYPES.find((t) => t.value === value)?.label || value;
}

export function getInvestorTypeColor(value: string): string {
  return INVESTOR_TYPES.find((t) => t.value === value)?.color || 'from-gray-500 to-gray-600';
}

export function getInvestorTypeBadge(value: string): string {
  return INVESTOR_TYPES.find((t) => t.value === value)?.badge || 'bg-gray-100 text-gray-700';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
