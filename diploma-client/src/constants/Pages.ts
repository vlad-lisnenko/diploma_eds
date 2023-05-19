export enum Pages {
  SEARCH_BY_WORD_PAGE = '/dictionary/:firstLanguage-:secondLanguage/search/:word/page/:pageNumber',
  // SEARCH_BY_LETTER_PAGE = '/:firstLanguage/:secondLanguage/letters/:letter/page/:pageNumber?pageSize=:pageSize',
  SEARCH_BY_LETTER_PAGE = '/:firstLanguage/:secondLanguage/letters/:letter/page/:pageNumber',
  UPDATE_ARTICLE_PAGE = '/articles/:id/edit',
  CREATE_ADMIN_PAGE = '/create/admin',
  ARTICLE_PAGE = '/articles/:articleId',
  CREATE_ARTICLE_PAGE = '/create',
  UPLOAD_FILE_PAGE = '/upload',
  LOGIN_PAGE = '/login',
  LOGOUT_PAGE = '/logout'
}

export const pathCreators = {
  searchByWord: (firstLanguage: string, secondLanguage: string, word: string, pageNumber: number, pageSize = 20) => {
    return `/dictionary/${firstLanguage}-${secondLanguage}/search/${word}/page/${pageNumber}?pageSize=${pageSize}`
  },

  searchByLetter: (firstLanguage: string, secondLanguage: string,
                   letter: string, pageNumber: number, pageSize = 20,
                   isSecondLanguage = false) => {
    return isSecondLanguage ? `/${firstLanguage}/${secondLanguage}/letters/${letter}/page/${pageNumber}?pageSize=${pageSize}&isSecondLanguage=true` :
      `/${firstLanguage}/${secondLanguage}/letters/${letter}/page/${pageNumber}?pageSize=${pageSize}`
  },

  updateArticle: (id: any) => `/articles/${id}/edit`,

  article: (id: any) => `/articles/${id}`
}

