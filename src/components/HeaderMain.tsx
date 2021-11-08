
import {Header, Image, } from 'semantic-ui-react'
import React, { Fragment } from 'react'



const HeaderMain = (props:any) => {
  return (
    <>
        <Header as='h1' color='teal' textAlign='center' inverted>
            <Image src='/shark.png' size='massive' />
            ReeFTY NFT Marketplace
            </Header>
    </>
  )
}

export default HeaderMain;