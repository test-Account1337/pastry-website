import { useLanguage } from '../context/LanguageContext';

export const translations = {
  en: {
    // Navigation
    home: 'Home',
    news: 'News',
    about: 'About',
    contact: 'Contact',
    categories: 'Categories',
    admin: 'Admin',
    search: 'Search',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Search
    searchPlaceholder: 'Search articles, chefs, techniques...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    resultsFound: 'results found',
    forQuery: 'for',
    
    // Articles
    readMore: 'Read More',
    publishedOn: 'Published on',
    by: 'by',
    views: 'views',
    likes: 'likes',
    readingTime: 'min read',
    
    // Footer
    footerSubtitle: 'African Union of Professional Chefs',
    footerDescription: 'Uniting African culinary professionals, promoting excellence, and advancing the gastronomy industry across the continent. Join our community of African chefs and culinary enthusiasts.',
    footerEmail: 'hello@pastrynews.com',
    footerPhone: '+212 612-345678',
    allRightsReserved: 'All rights reserved.',
    company: 'Company',
    LatestNews: 'Latest News',
    FeaturedStories: 'Featured Stories',
    ChefInterviews: 'Chef Interviews',
    UACPEvents: 'UACP Events',
    AfricanCuisine: 'African Cuisine',
    Competitions: 'Competitions',
    Events: 'Events',
    ChefTraining: 'Chef Training',
    AboutUs: 'About Us',
    Contact: 'Contact',
    PrivacyPolicy: 'Privacy Policy',
    TermsOfService: 'Terms of Service',
    
    // Actions
    viewAllNews: 'View All News →',
    startYourSearch: 'Start Your Search',
    enterSearchTerm: 'Enter a search term above to find articles about pastry chefs, techniques, and industry news.',
    
    // Filters
    filters: 'Filters',
    sortBy: 'Sort By',
    relevance: 'Relevance',
    latest: 'Latest First',
    oldest: 'Oldest First',
    popular: 'Most Popular',
    title: 'Title A-Z',
    clearAll: 'Clear all',
    activeFilters: 'Active filters',
    
    // Pagination
    page: 'Page',
    of: 'of',
    
    // Suggestions
    suggestions: 'Suggestions',
    checkSpelling: 'Check your spelling',
    tryGeneralKeywords: 'Try more general keywords',
    useDifferentTerms: 'Use different search terms',
    clearFilters: 'Clear some filters',
    
    // Categories
    chefInterviews: 'Chef Interviews',
    recipes: 'Recipes',
    techniques: 'Techniques',
    trends: 'Trends',
    
    // Categories (by slug)
    'chef-interviews': 'Chef Interviews',
    'recipes': 'Recipes',
    'techniques': 'Techniques',
    'pastry-trends': 'Trends',
    
    // Hero Section
    heroTitleLine1: 'African Union of',
    heroTitleLine2: 'Professional Chefs',
    heroSubtitle: 'Uniting African culinary professionals, promoting excellence, and advancing the gastronomy industry across the continent',
    heroBtnExplore: 'Explore News',
    heroBtnAbout: 'About UACP',
    
    // Language names
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // HomePage Sections
    featuredStories: 'Featured Stories',
    featuredStoriesDesc: 'Handpicked articles showcasing the best of culinary innovation, technique, and creativity',
    exploreCategories: 'Explore Categories',
    exploreCategoriesDesc: 'Dive into specific areas of culinary arts that interest you most',
    latestNews: 'Latest News',
    latestNewsDesc: 'Stay updated with the freshest content from the culinary world',
    joinCommunity: 'Join Our Community',
    joinCommunityDesc: 'Connect with African culinary professionals and enthusiasts worldwide',
    articlesPublished: 'Articles Published',
    expertChefs: 'Expert Chefs',
    monthlyReaders: 'Monthly Readers',
    stayConnected: 'Stay Connected & Updated!',
    newsletterSubtitle: 'Get the latest culinary news, exclusive recipes, and industry insights delivered straight to your inbox'
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    news: 'Actualités',
    about: 'À propos',
    contact: 'Contact',
    categories: 'Catégories',
    admin: 'Admin',
    search: 'Rechercher',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    close: 'Fermer',
    submit: 'Soumettre',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    
    // Search
    searchPlaceholder: 'Rechercher des articles, chefs, techniques...',
    searchResults: 'Résultats de recherche',
    noResults: 'Aucun résultat trouvé',
    resultsFound: 'résultats trouvés',
    forQuery: 'pour',
    
    // Articles
    readMore: 'Lire la suite',
    publishedOn: 'Publié le',
    by: 'par',
    views: 'vues',
    likes: 'j\'aime',
    readingTime: 'min de lecture',
    
    // Footer
    footerSubtitle: 'Union Africaine des Chefs Professionnels',
    footerDescription: 'Unir les professionnels culinaires africains, promouvoir l’excellence et faire progresser l’industrie gastronomique à travers le continent. Rejoignez notre communauté de chefs et passionnés africains.',
    footerEmail: 'hello@pastrynews.com',
    footerPhone: '+212 612-345678',
    allRightsReserved: 'Tous droits réservés.',
    company: 'Entreprise',
    LatestNews: 'Dernières actualités',
    FeaturedStories: 'Articles à la une',
    ChefInterviews: 'Interviews de Chefs',
    UACPEvents: 'Événements UACP',
    AfricanCuisine: 'Cuisine africaine',
    Competitions: 'Compétitions',
    Events: 'Événements',
    ChefTraining: 'Formation des chefs',
    AboutUs: 'À propos',
    Contact: 'Contact',
    PrivacyPolicy: 'Politique de confidentialité',
    TermsOfService: 'Conditions d’utilisation',
    
    // Actions
    viewAllNews: 'Voir toutes les actualités →',
    startYourSearch: 'Commencez votre recherche',
    enterSearchTerm: 'Entrez un terme de recherche ci-dessus pour trouver des articles sur les chefs pâtissiers, techniques et actualités du secteur.',
    
    // Filters
    filters: 'Filtres',
    sortBy: 'Trier par',
    relevance: 'Pertinence',
    latest: 'Plus récent',
    oldest: 'Plus ancien',
    popular: 'Plus populaire',
    title: 'Titre A-Z',
    clearAll: 'Tout effacer',
    activeFilters: 'Filtres actifs',
    
    // Pagination
    page: 'Page',
    of: 'sur',
    
    // Suggestions
    suggestions: 'Suggestions',
    checkSpelling: 'Vérifiez l\'orthographe',
    tryGeneralKeywords: 'Essayez des mots-clés plus généraux',
    useDifferentTerms: 'Utilisez des termes différents',
    clearFilters: 'Effacez certains filtres',
    
    // Categories
    chefInterviews: 'Interviews de Chefs',
    recipes: 'Recettes',
    techniques: 'Techniques',
    trends: 'Tendances',
    
    // Categories (by slug)
    'chef-interviews': 'Interviews de Chefs',
    'recipes': 'Recettes',
    'techniques': 'Techniques',
    'pastry-trends': 'Tendances',
    
    // Hero Section
    heroTitleLine1: 'Union Africaine des',
    heroTitleLine2: 'Chefs Professionnels',
    heroSubtitle: 'Unir les professionnels culinaires africains, promouvoir l’excellence et faire progresser l’industrie gastronomique à travers le continent',
    heroBtnExplore: 'Voir les actualités',
    heroBtnAbout: 'À propos de l’UACP',
    
    // Language names
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // HomePage Sections
    featuredStories: 'Articles à la une',
    featuredStoriesDesc: 'Articles sélectionnés mettant en avant l’innovation culinaire, la technique et la créativité',
    exploreCategories: 'Explorer les catégories',
    exploreCategoriesDesc: 'Plongez dans les domaines des arts culinaires qui vous intéressent le plus',
    latestNews: 'Dernières actualités',
    latestNewsDesc: 'Restez informé avec les contenus les plus récents du monde culinaire',
    joinCommunity: 'Rejoignez notre communauté',
    joinCommunityDesc: 'Connectez-vous avec des professionnels et passionnés de la cuisine africaine dans le monde entier',
    articlesPublished: 'Articles publiés',
    expertChefs: 'Chefs experts',
    monthlyReaders: 'Lecteurs mensuels',
    stayConnected: 'Restez connecté et informé !',
    newsletterSubtitle: 'Recevez les dernières actualités culinaires, des recettes exclusives et des analyses du secteur directement dans votre boîte mail'
  },
  
  ar: {
    // Navigation
    home: 'الرئيسية',
    news: 'الأخبار',
    about: 'حول',
    contact: 'اتصل بنا',
    categories: 'الفئات',
    admin: 'المدير',
    search: 'بحث',
    
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    close: 'إغلاق',
    submit: 'إرسال',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    
    // Search
    searchPlaceholder: 'البحث في المقالات والطهاة والتقنيات...',
    searchResults: 'نتائج البحث',
    noResults: 'لم يتم العثور على نتائج',
    resultsFound: 'نتيجة وجدت',
    forQuery: 'لـ',
    
    // Articles
    readMore: 'اقرأ المزيد',
    publishedOn: 'نشر في',
    by: 'بواسطة',
    views: 'مشاهدات',
    likes: 'إعجابات',
    readingTime: 'دقيقة للقراءة',
    
    // Footer
    footerSubtitle: 'الاتحاد الإفريقي للطهاة المحترفين',
    footerDescription: 'توحيد محترفي الطهي الأفارقة، وتعزيز التميز، وتطوير صناعة فنون الطهي عبر القارة. انضم إلى مجتمعنا من الطهاة وهواة الطهي الأفارقة.',
    footerEmail: 'hello@pastrynews.com',
    footerPhone: '+212 612-345678',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    company: 'الشركة',
    LatestNews: 'آخر الأخبار',
    FeaturedStories: 'قصص مميزة',
    ChefInterviews: 'مقابلات الطهاة',
    UACPEvents: 'فعاليات الاتحاد',
    AfricanCuisine: 'المطبخ الأفريقي',
    Competitions: 'المسابقات',
    Events: 'الفعاليات',
    ChefTraining: 'تدريب الطهاة',
    AboutUs: 'معلومات عنا',
    Contact: 'اتصل بنا',
    PrivacyPolicy: 'سياسة الخصوصية',
    TermsOfService: 'شروط الخدمة',
    
    // Actions
    viewAllNews: 'عرض جميع الأخبار →',
    startYourSearch: 'ابدأ بحثك',
    enterSearchTerm: 'أدخل مصطلح البحث أعلاه للعثور على مقالات حول طهاة الحلويات والتقنيات وأخبار الصناعة.',
    
    // Filters
    filters: 'المرشحات',
    sortBy: 'ترتيب حسب',
    relevance: 'الصلة',
    latest: 'الأحدث أولاً',
    oldest: 'الأقدم أولاً',
    popular: 'الأكثر شعبية',
    title: 'العنوان أ-ي',
    clearAll: 'مسح الكل',
    activeFilters: 'المرشحات النشطة',
    
    // Pagination
    page: 'صفحة',
    of: 'من',
    
    // Suggestions
    suggestions: 'اقتراحات',
    checkSpelling: 'تحقق من التهجئة',
    tryGeneralKeywords: 'جرب كلمات مفتاحية أكثر عمومية',
    useDifferentTerms: 'استخدم مصطلحات مختلفة',
    clearFilters: 'امسح بعض المرشحات',
    
    // Categories
    chefInterviews: 'مقابلات الطهاة',
    recipes: 'وصفات',
    techniques: 'تقنيات',
    trends: 'اتجاهات',
    
    // Categories (by slug)
    'chef-interviews': 'مقابلات الطهاة',
    'recipes': 'وصفات',
    'techniques': 'تقنيات',
    'pastry-trends': 'اتجاهات',
    
    // Hero Section
    heroTitleLine1: 'الاتحاد الإفريقي',
    heroTitleLine2: 'للطهاة المحترفين',
    heroSubtitle: 'توحيد محترفي الطهي الأفارقة، وتعزيز التميز، وتطوير صناعة فنون الطهي عبر القارة',
    heroBtnExplore: 'تصفح الأخبار',
    heroBtnAbout: 'حول الاتحاد',
    
    // Language names
    english: 'English',
    french: 'Français',
    arabic: 'العربية',
    
    // HomePage Sections
    featuredStories: 'قصص مميزة',
    featuredStoriesDesc: 'مقالات مختارة تعرض أفضل الابتكارات والتقنيات والإبداعات في فنون الطهي',
    exploreCategories: 'استكشف الفئات',
    exploreCategoriesDesc: 'استكشف مجالات فنون الطهي التي تهمك أكثر',
    latestNews: 'آخر الأخبار',
    latestNewsDesc: 'ابق على اطلاع بأحدث المحتويات من عالم الطهي',
    joinCommunity: 'انضم إلى مجتمعنا',
    joinCommunityDesc: 'تواصل مع محترفي وهواة الطهي الأفريقي حول العالم',
    articlesPublished: 'مقالات منشورة',
    expertChefs: 'طهاة خبراء',
    monthlyReaders: 'قراء شهريون',
    stayConnected: 'ابق على تواصل واطلع على الجديد!',
    newsletterSubtitle: 'احصل على آخر أخبار الطهي، وصفات حصرية، وتحليلات الصناعة مباشرة إلى بريدك الإلكتروني'
  }
};

// Hook to get translation
export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };
  
  return { t, currentLanguage };
}; 