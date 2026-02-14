import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `SnapLogic Analiz | #${params.id}`,
    description: 'Tradepigloball üzerinden oluşturulmuş profesyonel analiz.',
    openGraph: {
      images: ['/og.png'], // Public klasöründeki logon
    },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

