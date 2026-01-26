'use client';

import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();

  return (
    <div style={{ padding: 40 }}>
      <h1>Event Slug</h1>
      <p>{params.slug}</p>
    </div>
  );
}
