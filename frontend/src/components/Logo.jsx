import logoFull from '../assets/logo.jpg';
import logoIcon from '../assets/logo-icon.png';

/**
 * Logo oficial da Jaca 3D.
 *  - variant="full": logo completo (fruta + "JACA 3D"), em src/assets/logo.jpg
 *  - variant="icon": só a fruta, para espaços pequenos (barra lateral), em src/assets/logo-icon.png
 * Para trocar o logo, substitua os arquivos em src/assets/ mantendo os mesmos nomes.
 */
export default function Logo({ variant = 'full', className = 'h-14 w-14', alt = 'Logo Jaca 3D' }) {
  return (
    <img
      src={variant === 'icon' ? logoIcon : logoFull}
      alt={alt}
      width="150"
      height="150"
      className={`${className} shrink-0 rounded-xl object-cover`}
    />
  );
}
