import React from 'react'

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p>This page is under construction. Check back soon for updates!</p>
    </div>
  )
}

