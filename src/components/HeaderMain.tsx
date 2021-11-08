import {Header, Image, Segment} from 'semantic-ui-react'
import React from 'react'

const HeaderMain = () => (
    <Segment color='black' className='no-border-radius' raised inverted>
    <div>
        <Header as='h1' color='teal' textAlign='center' inverted>
            <Image src='/shark.png' />
            ReeFTY NFT Marketplace</Header>
    </div>
    </Segment>
)

export default HeaderMain