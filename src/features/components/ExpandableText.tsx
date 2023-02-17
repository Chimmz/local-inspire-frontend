import React from "react"

interface ExpandableTextProps{
  as: 'p' | 'span' | 'div'
  text: string,
}

const ExpandableText: React.FC<ExpandableTextProps> = function (props) {
  const dots = <span className='dots'>...</span>

  return (
    <></>
  )
}

export default ExpandableText