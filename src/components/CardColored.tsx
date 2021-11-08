
import {Card, CardContent, Image, Button,  Segment } from 'semantic-ui-react'
import React, { Fragment } from 'react'
import LazyLoad from 'react-lazyload';


const CardColored = (props:any) => {  
  return (
    <>
    <Card.Group itemsPerRow={4}>
        {props.items.map((item:any) => (
          <Card color='violet' key={item.itemId} image={item.image} fluid={true}>
          <CardContent>
            <LazyLoad height={200}>
            <Image src={item.image} />
            </LazyLoad>
          </CardContent>
          <div className='item-info'>
          <Card.Header className='item-name'>
          {item.name}
          </Card.Header>
          <Card.Meta className='item-seller'>
            Seller:{item.seller}
          </Card.Meta>
          <Card.Description>
        {item.description}
      </Card.Description>
      <Card.Content extra>
      <Segment.Group horizontal className='price-info'>
      <Segment >Price: {item.price} </Segment>
      <Segment> <Button basic color='purple' content='Buy' className='buy-button' item_id={item.itemId} nft_contract={item.nftContract} price={item.price} onClick={props.buyNft}/> </Segment>
        </Segment.Group>
    </Card.Content>
    </div>
          </Card>  
        ))}

    </Card.Group>
    </>
  )
}

export default CardColored;