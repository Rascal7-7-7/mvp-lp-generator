import { getSql } from './db'
import type {
  LandingPage,
  LandingPageWithRelations,
  LandingPageInput,
  Service,
  Notice,
} from './types'

export async function getLandingPageById(id: number): Promise<LandingPageWithRelations | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM landing_pages WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) return null
  const lp = rows[0] as LandingPage
  const services = await sql`SELECT * FROM services WHERE landing_page_id = ${id} ORDER BY sort_order`
  const notices = await sql`SELECT * FROM notices WHERE landing_page_id = ${id} ORDER BY sort_order`
  return { ...lp, services: services as Service[], notices: notices as Notice[] }
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageWithRelations | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM landing_pages WHERE slug = ${slug} LIMIT 1`
  if (rows.length === 0) return null
  const lp = rows[0] as LandingPage
  const services = await sql`SELECT * FROM services WHERE landing_page_id = ${lp.id} ORDER BY sort_order`
  const notices = await sql`SELECT * FROM notices WHERE landing_page_id = ${lp.id} ORDER BY sort_order`
  return { ...lp, services: services as Service[], notices: notices as Notice[] }
}

export async function getFirstLandingPage(): Promise<LandingPage | null> {
  const sql = getSql()
  const rows = await sql`SELECT * FROM landing_pages ORDER BY id LIMIT 1`
  if (rows.length === 0) return null
  return rows[0] as LandingPage
}

export async function createLandingPage(input: LandingPageInput): Promise<LandingPage> {
  const sql = getSql()
  const rows = await sql`
    INSERT INTO landing_pages (
      title, store_name, category, catch_copy, description,
      business_hours, closed_days, address, phone,
      instagram_url, line_url, main_image_url,
      cta_label, cta_link, template_key, slug, status
    ) VALUES (
      ${input.title}, ${input.store_name}, ${input.category},
      ${input.catch_copy}, ${input.description},
      ${input.business_hours}, ${input.closed_days},
      ${input.address}, ${input.phone},
      ${input.instagram_url || null}, ${input.line_url || null},
      ${input.main_image_url || null},
      ${input.cta_label}, ${input.cta_link},
      ${input.template_key}, ${input.slug}, ${input.status}
    )
    RETURNING *
  `
  const lp = rows[0] as LandingPage
  await upsertRelations(lp.id, input)
  return lp
}

export async function updateLandingPage(id: number, input: LandingPageInput): Promise<LandingPage> {
  const sql = getSql()
  let rows

  if (input.status === 'published') {
    rows = await sql`
      UPDATE landing_pages SET
        title = ${input.title},
        store_name = ${input.store_name},
        category = ${input.category},
        catch_copy = ${input.catch_copy},
        description = ${input.description},
        business_hours = ${input.business_hours},
        closed_days = ${input.closed_days},
        address = ${input.address},
        phone = ${input.phone},
        instagram_url = ${input.instagram_url || null},
        line_url = ${input.line_url || null},
        main_image_url = ${input.main_image_url || null},
        cta_label = ${input.cta_label},
        cta_link = ${input.cta_link},
        template_key = ${input.template_key},
        slug = ${input.slug},
        status = ${input.status},
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
  } else {
    rows = await sql`
      UPDATE landing_pages SET
        title = ${input.title},
        store_name = ${input.store_name},
        category = ${input.category},
        catch_copy = ${input.catch_copy},
        description = ${input.description},
        business_hours = ${input.business_hours},
        closed_days = ${input.closed_days},
        address = ${input.address},
        phone = ${input.phone},
        instagram_url = ${input.instagram_url || null},
        line_url = ${input.line_url || null},
        main_image_url = ${input.main_image_url || null},
        cta_label = ${input.cta_label},
        cta_link = ${input.cta_link},
        template_key = ${input.template_key},
        slug = ${input.slug},
        status = ${input.status},
        published_at = NULL,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
  }
  await upsertRelations(id, input)
  return rows[0] as LandingPage
}

async function upsertRelations(lpId: number, input: LandingPageInput) {
  const sql = getSql()
  await sql`DELETE FROM services WHERE landing_page_id = ${lpId}`
  await sql`DELETE FROM notices WHERE landing_page_id = ${lpId}`

  for (const [i, svc] of input.services.entries()) {
    await sql`
      INSERT INTO services (landing_page_id, name, description, price_text, sort_order)
      VALUES (${lpId}, ${svc.name}, ${svc.description || null}, ${svc.price_text || null}, ${i})
    `
  }

  for (const [i, notice] of input.notices.entries()) {
    await sql`
      INSERT INTO notices (landing_page_id, title, body, published_date, sort_order)
      VALUES (${lpId}, ${notice.title}, ${notice.body || null}, ${notice.published_date || null}, ${i})
    `
  }
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const sql = getSql()
  if (excludeId) {
    const rows = await sql`SELECT id FROM landing_pages WHERE slug = ${slug} AND id != ${excludeId}`
    return rows.length > 0
  }
  const rows = await sql`SELECT id FROM landing_pages WHERE slug = ${slug}`
  return rows.length > 0
}
