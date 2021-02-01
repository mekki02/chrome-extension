const translations = {
    fr: {
        loginSection: {
            connectionPlaceholder: 'Connectez-vous à votre compte',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mot de passe',
            noAccountPlaceholder: "Vous n'avez pas de compte ?",
            signupPlaceholder: "S'inscrire",
            forgottenPasswordPlaceholder: 'Mot de passe oublié ?',
            signInPlaceholder: 'Se connecter',
            errors: {
                wrongPassword: '* Mot de passe incorrect',
                invalidEmail: '* Email invalide',
                userNotFound: "* Aucun compte n'est inscrit avec cet email",
                tooManyRequests: '* Compte temporairement fermé à cause de plusieurs tentatives de connexion'
            },
        },
        wishlistSection: {
            stepOnePlaceholder: "1. Choisi une wishlist pour y ajouter des produits !",
            wishlistSelectorPlaceholder: 'Choisir une wishlist',
            wishlistCreationLabel: 'Ou crée une nouvelle wishlist !',
            wishlistCreationPlaceholder: 'Créer une wishlist',
            stepTwoPlaceholder: '2. Choisi une marque !',
            brandListPlaceholder: "Liste des marques",
            wishlistNameLabel: 'Entrer le nom de la wishlist',
            wishlistNameInputPlaceholder: 'Nom de la wishlist...',
            wishlistButtonPlaceholder: 'Créer wishlist',
            stepTwoPrimePlaceholder: '2. Choisi la marque que tu souhaites !',
            categoriesSelectorPlaceholder: 'Catégories',
            noBrandPlaceholder: 'Pas de marque sous cette catégorie',
            noWishlistsPlaceholder: 'Aucune wishlist créée'
        },
        instructionsSection: {
            stepThreePlaceholder: '3. Clique droit sur le produit que tu souhaite ajouter et clique sur « ajouter à la wishlist » pour ajouter à ta wishlist',
        }
    },
    en: {
        loginSection: {
            connectionPlaceholder: 'Connect to your account',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password',
            noAccountPlaceholder: "You don't have an account ?",
            signupPlaceholder: "Sign up",
            forgottenPasswordPlaceholder: 'Forgotten password ?',
            signInPlaceholder: 'Sign In',
            errors: {
                wrongPassword: '* Wrong Password',
                invalidEmail: '* Invalid email',
                userNotFound: '* No account registered with this mail address',
                tooManyRequests: '* Account temporarly closed due to too many login attempts'
            },
        },
        wishlistSection: {
            stepOnePlaceholder: "1. Choose a wishlist in which you want to add products !",
            wishlistSelectorPlaceholder: 'Choose a wishlist',
            wishlistCreationLabel: 'Or create a new wishlist !',
            wishlistCreationPlaceholder: 'Create wishlist',
            stepTwoPlaceholder: '2. Choose a brand !',
            brandListPlaceholder: "Brand list",
            wishlistNameLabel: "Enter wishlist's name",
            wishlistNameInputPlaceholder: "Wishlist's name",
            wishlistButtonPlaceholder: 'Create wishlist',
            stepTwoPrimePlaceholder: '2. Choose the brand you want !',
            categoriesSelectorPlaceholder: 'Categories',
            noBrandPlaceholder: 'Pas de marque sous cette catégorie',
            noWishlistsPlaceholder: 'Empty wishlists'
        },
        instructionsSection: {
            stepThreePlaceholder: '3. Right click on the product you want to add and click on « Add to wishlist » in order to add it to your wishlist',
        }
    }
}

export default translations;