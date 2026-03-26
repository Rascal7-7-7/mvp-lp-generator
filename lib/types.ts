export type LPStatus = 'draft' | 'published'

export interface Service {
  id: number
  landing_page_id: number
  name: string
  description: string | null
  price_text: string | null
  sort_order: number
}

export interface Notice {
  id: number
  landing_page_id: number
  title: string
  body: string | null
  published_date: string | null
  sort_order: number
}

export interface LandingPage {
  id: number
  title: string
  store_name: string
  category: string
  catch_copy: string
  description: string
  business_hours: string
  closed_days: string
  address: string
  phone: string
  instagram_url: string | null
  line_url: string | null
  main_image_url: string | null
  cta_label: string
  cta_link: string
  template_key: string
  slug: string
  status: LPStatus
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface LandingPageWithRelations extends LandingPage {
  services: Service[]
  notices: Notice[]
}

export type ServiceInput = Omit<Service, 'id' | 'landing_page_id'>
export type NoticeInput = Omit<Notice, 'id' | 'landing_page_id'>

export interface LandingPageInput {
  title: string
  store_name: string
  category: string
  catch_copy: string
  description: string
  business_hours: string
  closed_days: string
  address: string
  phone: string
  instagram_url: string
  line_url: string
  main_image_url: string
  cta_label: string
  cta_link: string
  template_key: string
  slug: string
  status: LPStatus
  services: ServiceInput[]
  notices: NoticeInput[]
}
