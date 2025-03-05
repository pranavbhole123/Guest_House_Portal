import React from 'react'
import campusMap from "../images/campusMap.pdf"

const PDFViewer = () => {
  return (
    <div>
        <iframe src={campusMap} type="application/pdf" width="100%" height="1118px" />
    </div>
  )
}

export default PDFViewer;