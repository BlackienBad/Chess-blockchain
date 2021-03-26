import {
    Navbar,
    NavbarBrand,
    NavbarText
  } from 'reactstrap';
function NavBar({account, balanceOf, balanceOfContract}) {
    return (
        <div>
      <Navbar style={{backgroundColor:'#3caea3'}}>
        <NavbarBrand href="/" style={{color:'white'}}>Chess</NavbarBrand>
        <NavbarText> </NavbarText>
        <NavbarText style={{fontSize:"12px", color:'blue'}}>account: {account}</NavbarText>
        <NavbarText> </NavbarText>
        <NavbarText style={{fontSize:"12px", color:'black'}}>balance: {balanceOf}</NavbarText>
        <NavbarText> </NavbarText>
        <NavbarText style={{fontSize:"12px", color:'red'}}>balance countract: {balanceOfContract}</NavbarText>
      </Navbar>
    </div>
    );
  }
  
  export default NavBar;