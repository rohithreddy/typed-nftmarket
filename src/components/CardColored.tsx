
import {Card, CardContent, Image } from 'semantic-ui-react'
import React, { Fragment } from 'react'



const CardColored = (props:any) => {
  return (
    <>
    <Card.Group itemsPerRow={4}>
        {props.items.map((item:any) => (
          <Card color='purple' key={item} image={item.image}>{item.seller}
          <CardContent>
            <Image src={item.image} />
          </CardContent>
          {item.name}
          {item.price}
          </Card>  
        ))}

    </Card.Group>
    </>
  )
}

export default CardColored;