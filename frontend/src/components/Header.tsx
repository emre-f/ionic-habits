import { Link, useParams, useLocation } from 'react-router-dom'
import "../styles/Header.css"
import { useAuthUser } from 'react-auth-kit'

const HeaderLink: React.FC<any> = ({ page, to, selected }) => {
    const title = page.charAt(0).toUpperCase() + page.slice(1);
    var link = to ? to : `/${page}`; // Either something specific or the name of the page

    var className = selected ? 'headerlink-no-link ' : '';
    className += 'headerlink-title';

    return (
        <Link to={link} className={className}>
            {title}
            <div className={selected ? 'headerlink-dot-active' : 'headerlink-dot'}>•</div>
        </Link>
    )
};

function Header() {
    const auth = useAuthUser();
    const location = useLocation();
    const page = location.pathname;
    console.log(auth())
    let user = auth();

    return (
        <div className='header'>
            <HeaderLink page="home" to="/" selected={page === '/'} />
            <HeaderLink page="about" selected={page === '/about'} />
            <HeaderLink page="signup" selected={page === '/signup'} />
            {user ?
                <>  
                    <HeaderLink page="profile" to={`/user/${user.id}`} selected={page === `/user/${user.id}`} />
                    <HeaderLink page="logout" selected={page === '/logout'} />
                </>
                :
                <HeaderLink page="login" selected={page === '/login'} />
            }
        </div>
    )
}

export default Header