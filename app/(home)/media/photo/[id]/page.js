import React from 'react'

export default function PhotoViewerPage({ params }) {
    const { id } = params;
  return (
    <div>
        Photo ID: {id}
    </div>
  )
}
