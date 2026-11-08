// Demo data matching the SVG designs – replace with API calls later

export const CATEGORIES = [
  { id: 'health', label: 'Health', emoji: '🏥' },
  { id: 'beauty', label: 'Beauty', emoji: '💅' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'repair', label: 'Repair', emoji: '🔧' },
  { id: 'more', label: 'More', emoji: '✨' },
]

export const ORGANIZATIONS = [
  {
    id: 'org-1',
    name: 'Glow Beauty Salon',
    rating: 4.9,
    reviews: 124,
    distance: '2.3 km',
    category: 'Beauty',
    open: true,
    closes: '8:00 PM',
    location: 'Lekki, Lagos',
    hours: 'Mon – Sun  8:00 AM – 8:00 PM',
    description: 'Professional beauty services to help you look and feel your best. We offer hair, skin and nail services.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    ],
  },
  {
    id: 'org-2',
    name: 'Prime Health Clinic',
    rating: 4.7,
    reviews: 89,
    distance: '1.5 km',
    category: 'Health',
    open: true,
    closes: '7:00 PM',
    location: 'Victoria Island, Lagos',
    hours: 'Mon – Sat  8:00 AM – 7:00 PM',
    description: 'Modern clinic offering general consultations, diagnostics and wellness checks.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    gallery: [],
  },
  {
    id: 'org-3',
    name: 'Bella Spa & Wellness',
    rating: 4.6,
    reviews: 98,
    distance: '1.8 km',
    category: 'Beauty',
    open: true,
    closes: '9:00 PM',
    location: 'Ikoyi, Lagos',
    hours: 'Mon – Sun  9:00 AM – 9:00 PM',
    description: 'Relaxing spa treatments, massages and full-body wellness packages.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    gallery: [],
  },
  {
    id: 'org-4',
    name: 'Hair Zone Studio',
    rating: 4.5,
    reviews: 76,
    distance: '3.2 km',
    category: 'Beauty',
    open: true,
    closes: '8:00 PM',
    location: 'Yaba, Lagos',
    hours: 'Tue – Sun  9:00 AM – 8:00 PM',
    description: 'Trendy hair studio specialising in cuts, colour and protective styles.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
    gallery: [],
  },
  {
    id: 'org-5',
    name: 'Nail Bar Lekki',
    rating: 4.4,
    reviews: 61,
    distance: '4.0 km',
    category: 'Beauty',
    open: false,
    closes: '7:00 PM',
    location: 'Lekki Phase 1, Lagos',
    hours: 'Mon – Sat  10:00 AM – 7:00 PM',
    description: 'Premium manicures, pedicures and nail art.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    gallery: [],
  },
]

export const SERVICES = [
  { id: 'svc-1', orgId: 'org-1', name: 'Hair Styling', category: 'Hair', price: 15000, duration: 60, description: 'Professional styling for any occasion.' },
  { id: 'svc-2', orgId: 'org-1', name: 'Braiding', category: 'Hair', price: 20000, duration: 90, description: 'Professional braiding with your choice of style and length.', includes: ['Hair wash', 'Hair care products'] },
  { id: 'svc-3', orgId: 'org-1', name: 'Hair Treatment', category: 'Hair', price: 25000, duration: 60, description: 'Deep conditioning and repair treatment.' },
  { id: 'svc-4', orgId: 'org-1', name: 'Facial Treatment', category: 'Skin', price: 18000, duration: 60, description: 'Cleansing, exfoliation and hydration facial.' },
  { id: 'svc-5', orgId: 'org-1', name: 'Manicure', category: 'Nails', price: 10000, duration: 45, description: 'Classic manicure with polish.' },
  { id: 'svc-6', orgId: 'org-1', name: 'Massage', category: 'Skin', price: 20000, duration: 90, description: 'Full body relaxing massage.' },
]

export const WORKERS = [
  { id: 'w-1', orgId: 'org-1', name: 'Sarah Johnson', title: 'Senior Stylist', rating: 4.8, reviews: 58, available: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { id: 'w-2', orgId: 'org-1', name: 'Grace Williams', title: 'Stylist', rating: 4.7, reviews: 43, available: true, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
  { id: 'w-3', orgId: 'org-1', name: 'Mary Smith', title: 'Stylist', rating: 4.6, reviews: 32, available: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { id: 'w-4', orgId: 'org-1', name: 'Tina Brown', title: 'Junior Stylist', rating: 4.5, reviews: 36, available: false, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
]

export const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']

export const APPOINTMENTS = [
  {
    id: 'apt-1',
    service: 'Braiding',
    org: 'Glow Beauty Salon',
    orgId: 'org-1',
    worker: 'Sarah Johnson',
    date: 'Wed, Apr 16, 2025',
    time: '10:00 AM',
    duration: 90,
    price: 20000,
    status: 'confirmed',
  },
  {
    id: 'apt-2',
    service: 'Consultation',
    org: 'Prime Health Clinic',
    orgId: 'org-2',
    worker: 'Dr. Okoro',
    date: 'Fri, Apr 18, 2025',
    time: '2:00 PM',
    duration: 30,
    price: 8000,
    status: 'confirmed',
  },
  {
    id: 'apt-3',
    service: 'Facial Treatment',
    org: 'Bella Spa & Wellness',
    orgId: 'org-3',
    worker: 'Adaeze',
    date: 'Mon, Apr 21, 2025',
    time: '11:00 AM',
    duration: 60,
    price: 18000,
    status: 'confirmed',
  },
]

export const NOTIFICATIONS = [
  { id: 1, title: 'Appointment reminder', body: 'Your appointment is tomorrow at 10:00 AM.', time: '2h ago', unread: true },
  { id: 2, title: 'Queue update', body: "You're next in line at Glow Beauty Salon.", time: '1h ago', unread: true },
  { id: 3, title: 'Booking confirmed', body: 'Your appointment has been confirmed.', time: '3h ago', unread: false },
  { id: 4, title: 'Special offer', body: 'Get 20% off your next service!', time: '1d ago', unread: false },
]

export const REVIEWS = [
  { id: 1, name: 'Tomi Adeyemi', rating: 5, date: '2 days ago', text: 'Great service and friendly staff!' },
  { id: 2, name: 'Chioma Okafor', rating: 5, date: '1 week ago', text: 'Loved my braids, very neat and quick.' },
  { id: 3, name: 'Kunle A.', rating: 4, date: '2 weeks ago', text: 'Good experience overall, slightly delayed start.' },
]

export function formatNaira(n) {
  return `₦${Number(n).toLocaleString()}`
}
