import Button from './Button'
import { useLocation } from 'react-router-dom';

const Header = (props) => {
  const location = useLocation();
  const onClick = ()=>{
    props.onAdd();

    //console.log("clicked")
  }
  return (
    <header className='header'>
      <h1>{props.title}</h1>
      {
        location.pathname==='/' && 
        (<Button onClick={onClick} color={props.showAdd?'red' : 'green'}
         text={props.showAdd?"Close":"Add"} />)
      }
      
    </header>
  )
}


export default Header
