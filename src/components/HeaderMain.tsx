
import {Header, Image, Segment, Dropdown, Grid} from 'semantic-ui-react'
import React, { Fragment } from 'react'



const HeaderMain = (props:any) => {
  console.log("The props")
  console.log(props)
  return (
    <>
    {/* <Segment color='black' className='no-border-radius' raised inverted> */}
        <Header as='h1' color='teal' textAlign='center' inverted>
            <Image src='/shark.png' size='massive' />
            ReeFTY NFT Marketplace
            </Header>
            {/* <Dropdown text='Select Account' className='drop-head' options={props.acMap} onChange={props._onChangeAccountId1} value={props.avalue}/> */}
    {/* </Segment> */}
    </>
  )
}

export default HeaderMain;
// class HeaderMain extends React.Component<any, any> {
//   constructor(props:any) {
//     super(props)
    
//   }
//   render() {
//     return (
//           <>
//           <Segment color='black' className='no-border-radius' raised inverted>
//               <Header as='h1' color='teal' textAlign='center' inverted>
//                   <Image src='/shark.png' size='massive' />
//                   ReeFTY NFT Marketplace
//                   </Header>
//                   <Dropdown text='Select Account' className='drop-head' options={this.acMap} onChange={props._onChangeAccountId1} value={props.avalue}/>
//           </Segment>
//           </>
//         )
//   }
// }