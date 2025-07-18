import SunIcon from '@/assets/icons/sun.svg';
import MoonIcon from '@/assets/icons/moon.svg';

const Header = ({ theme, toggleTheme }) => {
    return (
        <div id="header">
            <h1>Peek</h1>
            <div id="theme-switcher">
                <button onClick={toggleTheme} title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}>
                    {theme === "light" ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
        </div>
    );
};

export default Header;
