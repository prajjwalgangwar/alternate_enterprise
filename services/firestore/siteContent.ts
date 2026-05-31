import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

const CONTENT_DOC_ID = 'site-content'

function getDocRef() {
  return doc(db, 'siteContent', CONTENT_DOC_ID)
}

export interface SiteContent {
  [key: string]: string | string[]
}

const defaults: SiteContent = {
  nav_home: 'Home',
  nav_offerings: 'Our Offerings',
  nav_contact: 'Contact',
  nav_about: 'About Us',
  nav_privacy: 'Privacy Policy',
  nav_terms: 'Terms of Service',
  nav_faq: 'FAQ',

  header_health_warning: 'Tobacco products are not a safe alternative to cigarettes. This site is for B2B trade professionals only.',
  header_logo_alt: 'Alternate Enterprises',
  header_tagline: 'Strong Leaf, Strong Relationships',

  footer_company_name: 'ALTERNATE ENTERPRISES',
  footer_description: 'Premium luxury tobacco exports showcasing the finest selections from around the world.',
  footer_products_heading: 'Products',
  footer_product_list: ['FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured'],
  footer_quick_links_heading: 'Quick Links',
  footer_quick_links: ['About Us', 'Privacy Policy', 'Terms of Service', 'FAQ'],
  footer_contact_heading: 'Contact',
  footer_email: 'info@alternateenterprises.com',
  footer_phone: '+1 (555) 000-0000',
  footer_health_warning: 'WARNING: These products are intended for use by adults 21 years or older. Tobacco products are not safe and are addictive. This website is intended for B2B trade professionals only. All products are for export purposes only.',
  footer_copyright: 'Alternate Enterprises. All rights reserved.',

  home_hero_badge: 'Established 2024',
  home_hero_heading_1: 'Premium',
  home_hero_heading_2: 'Tobacco',
  home_hero_heading_3: 'Exports',
  home_hero_description: 'Sourcing the world\u2019s finest tobacco leaves since 2024. Expertly curated selections for discerning international trade partners.',
  home_hero_cta_1: 'Explore Collection',
  home_hero_cta_2: 'Request a Quote',
  home_stats: [
    '39+|Premium Varieties',
    '4|Growing Regions',
    '50+|Export Partners',
    '2024|Established',
  ],
  home_categories_section_label: 'Our Selection',
  home_categories_heading: 'Tobacco Categories',
  home_categories_description: 'From bright Virginia to rich Burley, each variety is selected for its exceptional quality',
  home_categories_items: [
    'FCV Tobacco|Bright, flue-cured Virginia with golden leaf and balanced sugar content.|Nicotine: 1.5-3.5% | Sugar: 12-20%',
    'Burley Tobacco|Air-cured with rich, full-bodied character and low sugar profile.|Nicotine: 2.0-4.0% | Sugar: 1-3%',
    'Country Blend|Artisanal blends combining the finest leaves for a distinctive profile.|Nicotine: 1.8-3.2% | Sugar: 8-15%',
    'Zimbabwe Cured|Premium African-cured tobacco with exceptional aroma and flavor.|Nicotine: 1.2-2.8% | Sugar: 14-22%',
  ],
  home_featured_section_label: 'Featured Selection',
  home_featured_heading: 'Premium Collection',
  home_featured_description: 'Our curated selection of the finest tobacco products available for export.',
  home_contact_section_label: 'Connect',
  home_contact_heading: 'Get In Touch',
  home_contact_description: 'Interested in bulk orders, partnerships, or distribution? Contact us with your inquiry.',
  home_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  catalogue_categories: ['All', 'FCV Tobacco', 'Burley Tobacco', 'Country Blend', 'Zimbabwe Cured'],
  catalogue_search_placeholder: 'Search products...',
  catalogue_error_message: 'Unable to load products at this time.',
  catalogue_empty_message: 'No products found for this category.',
  catalogue_spec_nico: 'Nico',
  catalogue_spec_sugar: 'Sugar',
  catalogue_spec_body: 'Body',
  catalogue_spec_color: 'Color',
  catalogue_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  contact_hero_badge: 'Connect With Us',
  contact_hero_heading_1: 'Get In',
  contact_hero_heading_2: 'Touch',
  contact_hero_description: 'Interested in bulk orders, partnerships, or distribution? Send us your inquiry and our team will respond within 24 hours.',
  contact_section_heading: 'Let\u2019s Start a Conversation',
  contact_section_description: 'Whether you\u2019re looking to place a bulk order, explore partnership opportunities, or discuss distribution rights \u2014 we\u2019re here to help.',
  contact_email_label: 'Email',
  contact_email_value: 'info@alternateenterprises.com',
  contact_phone_label: 'Phone',
  contact_phone_value: '+1 (555) 000-0000',
  contact_location_label: 'Location',
  contact_location_value: 'Global Operations \u2014 Serving International Markets',
  contact_info_box_label: 'B2B Trade Only',
  contact_info_box_text: 'All inquiries are handled by our trade team. We respond to bulk order and partnership requests within 24 hours.',
  contact_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  about_hero_badge: 'About Us',
  about_hero_heading_1: 'Our',
  about_hero_heading_2: 'Story',
  about_hero_description: 'From the finest tobacco-growing regions to the world\'s most discerning markets — Alternate Enterprises delivers excellence in every leaf.',
  about_mission_heading: 'Our Mission',
  about_mission_body: 'To bridge the gap between the world\'s premier tobacco growers and international markets through uncompromising quality, ethical sourcing, and deep industry expertise. We believe in building relationships that span generations.',
  about_values_heading: 'Our Values',
  about_values_items: [
    'Quality First|Every leaf is hand-selected and rigorously tested to ensure it meets our exacting standards before it reaches our partners.',
    'Integrity|We operate with complete transparency in every transaction, from sourcing to shipping, building trust that lasts.',
    'Global Expertise|With deep knowledge of tobacco markets across five continents, we navigate international trade with precision and cultural understanding.',
    'Sustainability|We work with growers who share our commitment to responsible farming practices and long-term environmental stewardship.',
  ],
  about_stats: [
    '2024|Year Established',
    '50+|Export Partners',
    '12|Growing Regions',
    '100%|Client Satisfaction',
  ],
  about_content: 'At Alternate Enterprises, we understand that premium tobacco is more than a product — it is a craft. Our journey began with a simple vision: to connect the world\'s finest tobacco producers with the international market\'s most discerning buyers.\n\nToday, we work with growers across twelve distinct growing regions, each selected for their unique terroir and commitment to quality. From the bright, golden leaves of Flue-Cured Virginia to the rich, complex profiles of Zimbabwe Cured, every product in our portfolio represents the pinnacle of tobacco craftsmanship.\n\nOur team brings together decades of combined experience in tobacco trading, logistics, and international commerce. We pride ourselves on our ability to navigate complex regulatory environments while maintaining the personal touch that defines true partnership.\n\nWhether you are a established manufacturer seeking consistent supply or an emerging market looking for premium import options, Alternate Enterprises is your trusted partner in tobacco excellence.',
  about_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  privacy_hero_badge: 'Privacy',
  privacy_hero_heading_1: 'Privacy',
  privacy_hero_heading_2: 'Policy',
  privacy_hero_description: 'How we collect, use, and protect your information.',
  privacy_content: 'Alternate Enterprises respects your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our website or engage with our services.\n\nInformation We Collect: We may collect business contact information including name, company name, email address, phone number, and country of operation when you submit inquiries or register for our services.\n\nHow We Use Your Information: We use your information to respond to inquiries, process orders, improve our services, and comply with legal obligations. We do not sell or share your personal data with third parties for marketing purposes.\n\nData Security: We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.\n\nYour Rights: You have the right to request access to, correction of, or deletion of your personal data held by us. Contact us at info@alternateenterprises.com for any privacy-related requests.',
  privacy_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  terms_hero_badge: 'Terms',
  terms_hero_heading_1: 'Terms of',
  terms_hero_heading_2: 'Service',
  terms_hero_description: 'Terms and conditions governing the use of our website and services.',
  terms_content: 'By accessing and using the Alternate Enterprises website and services, you agree to comply with and be bound by the following terms and conditions.\n\nB2B Transactions Only: All products and services offered on this website are intended for business-to-business transactions only. By using this site, you represent that you are a legitimate business entity or trade professional in the tobacco industry.\n\nAge Restriction: You must be 21 years of age or older to access this website. If you are under 21, you are not authorized to use this site.\n\nProduct Information: While we strive to provide accurate product descriptions and specifications, we do not warrant that descriptions or other content are complete, reliable, or error-free. All products are for export purposes only.\n\nLimitation of Liability: Alternate Enterprises shall not be liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use our products or services.\n\nGoverning Law: These terms shall be governed by and construed in accordance with applicable international trade laws.',
  terms_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  faq_hero_badge: 'FAQ',
  faq_hero_heading_1: 'Frequently',
  faq_hero_heading_2: 'Asked Questions',
  faq_hero_description: 'Find answers to common questions about our products and services.',
  faq_items: [
    'What types of tobacco do you export?|We export a wide range of tobacco varieties including FCV (Flue-Cured Virginia), Burley, Country Blend, and Zimbabwe Cured tobacco. Each variety is carefully selected for quality and consistency.',
    'What is the minimum order quantity?|Minimum order quantities vary by product and destination. Please contact our sales team for specific MOQ details tailored to your requirements.',
    'How do you ensure product quality?|We work directly with trusted growers and conduct rigorous quality control at every stage from cultivation to shipping. Each batch is tested for nicotine content, sugar levels, and overall leaf quality.',
    'What are your shipping and delivery times?|We ship to destinations worldwide. Typical delivery times range from 7\u201321 business days depending on the destination and shipping method selected.',
    'Do you offer samples?|Yes, we offer sample packages for B2B partners. Please contact us with your specific requirements and we will arrange sample shipments.',
    'How can I place an order?|You can place an order by contacting us through our website form, email, or phone. Our team will guide you through the process and provide a customized quote.',
  ],
  faq_health_warning: 'SURGEON GENERAL WARNING: Tobacco products cause cancer, heart disease, emphysema, and complications during pregnancy. This site is for B2B trade professionals only. Must be 21+ to access.',

  section_age_gate_visible: 'true',
  section_about_visible: 'true',
  section_privacy_visible: 'true',
  section_terms_visible: 'true',
  section_faq_visible: 'true',

  age_gate_heading: 'Age Verification',
  age_gate_description: 'You must be 21 years or older to access this website. Please confirm your age to enter.',
  age_gate_yes_button: 'I Am 21 or Older',
  age_gate_no_button: 'I Am Under 21',
  age_gate_redirect_url: 'https://google.com',
  age_gate_image: '',

  section_header_banner_visible: 'true',
  section_hero_visible: 'true',
  section_stats_visible: 'true',
  section_categories_visible: 'true',
  section_featured_visible: 'true',
  section_contact_visible: 'true',
  section_health_warning_visible: 'true',
  section_footer_visible: 'true',
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const ref = getDocRef()
    const snapshot = await getDoc(ref)
    if (snapshot.exists()) {
      return snapshot.data() as SiteContent
    }
    await setDoc(ref, defaults)
    return defaults
  } catch {
    return defaults
  }
}

export async function updateSiteContent(content: Partial<SiteContent>): Promise<void> {
  const ref = getDocRef()
  await setDoc(ref, content, { merge: true })
}

export { defaults as defaultSiteContent }
