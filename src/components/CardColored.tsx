
import {Card, Image, } from 'semantic-ui-react'
import React, { Fragment } from 'react'



const CardColored = (props:any) => {
  return (
    <>
    <Card.Group itemsPerRow={4}>
        {props.items.map((item:any) => (
          <Card>{item.seller}</Card>  
        ))}

    </Card.Group>
    </>
  )
}

export default CardColored;