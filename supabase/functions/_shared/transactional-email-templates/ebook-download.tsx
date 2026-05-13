import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Global Moves Network'

interface EbookDownloadProps {
  downloadUrl?: string
}

const EbookDownloadEmail = ({ downloadUrl }: EbookDownloadProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Remote Work Beginner's Ebook is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Thank you for your purchase!</Heading>
        <Text style={text}>
          Your copy of the <strong>Remote Work Beginner's Ebook</strong> is ready.
          Click the button below to download your PDF.
        </Text>
        {downloadUrl && (
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button href={downloadUrl} style={button}>
              Download Your Ebook
            </Button>
          </Section>
        )}
        <Text style={text}>
          Save the file somewhere safe — you can re-download anytime using this email.
        </Text>
        <Text style={text}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>{downloadUrl}</Text>
        <Text style={footer}>
          Wishing you success on your remote work journey,<br />
          The {SITE_NAME} Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: EbookDownloadEmail,
  subject: 'Your Remote Work Ebook is ready to download',
  displayName: 'Ebook download link',
  previewData: {
    downloadUrl:
      'https://ezmughqpucdfuzldljtu.supabase.co/storage/v1/object/public/ebooks/Remote_Work_Beginners_Ebook.pdf',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0f4c5c',
  margin: '0 0 24px',
}
const text = {
  fontSize: '15px',
  color: '#374151',
  lineHeight: '1.6',
  margin: '0 0 16px',
}
const linkText = {
  fontSize: '12px',
  color: '#0f4c5c',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px',
}
const button = {
  backgroundColor: '#0f4c5c',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
}
const footer = {
  fontSize: '13px',
  color: '#6b7280',
  margin: '32px 0 0',
}
