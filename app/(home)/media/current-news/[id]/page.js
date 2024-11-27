import React from 'react'

export default function CurrentNewsDetailsPage({ params }) {
    const { id } = params;
  return (
    <div>
        News ID: {id}
    </div>
  )
}
