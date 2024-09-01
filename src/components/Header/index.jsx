import './styles.scss'
import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';
import { Toaster } from 'react-hot-toast';

export function Header() {
  return(
    <header className='headerContainer'>
      <div className='headerContent'>
        <h1>Unifil<span>.News</span></h1>
        <nav>
          <ActiveLink activeClassName='active' to="/">
            <p>Home</p>
          </ActiveLink>
          <ActiveLink activeClassName='active' to="/posts">
            <p>Posts</p>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}