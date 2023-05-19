import React, {FC} from 'react';
import {SecuredRoute} from "./SecuredRoute";
import {DefaultLayout} from "./layout/DefaultLayout";
import {ChangePasswordPage} from "./pages/ChangePasswordPage/ChangePasswordPage";
import {Route, Switch} from "react-router-dom";
import {SearchArticlesPage} from "./pages/SearchArticlesPage";
import {LetterPageArticles} from "./pages/LetterPageArticles/LetterPageArticles";
import {UpdateArticlePage} from "./pages/UpdateArticlePage/UpdateArticlePage";
import {CreateAdminPage} from "./pages/CreateAdminPage/CreateAdminPage";
import {DictionaryArticlePage} from "./pages/DictionaryArticlePage/DictionaryArticlePage";
import {AddArticlePage} from "./pages/AddArticlePage/AddArticlePage";
import {UploadFile} from "./pages/UploadFile/UploadFile";
import {LoginPage} from "./pages/LoginPage/LoginPage";
import {SearchWordPage} from "./pages/SearchWordPage/SearchWordPage";
import {Logout} from "./Logout/Logout";
import {Pages} from "../constants/Pages";
import {LanguagesPage} from "./pages/LanguagesPage/LanguagesPage";
import {LanguageCreatePage} from "./pages/LanguageCreatePage/LanguageCreatePage";
import {AdminsPage} from "./pages/AdminsPage";
import {Authority} from "../types/Authority";

export const Routes: FC = () => {
  return (
    <Switch>
      <SecuredRoute authorities={[Authority.ROOT]} exact path="/admins" render={() => <DefaultLayout render={() => <AdminsPage />} />} />
      <SecuredRoute exact path="/languages" render={() => <DefaultLayout render={() => <LanguagesPage />} />}/>
      <SecuredRoute exact path="/languages/add" render={() => <DefaultLayout render={() => <LanguageCreatePage />} />}/>
      <SecuredRoute exact path="/change-password" render={() => <DefaultLayout hideDictionaryComponents
                                                                               render={() =>
                                                                                 <ChangePasswordPage/>}/>}/>
      <Route exact path={Pages.SEARCH_BY_WORD_PAGE}
             render={() => <DefaultLayout render={() => <SearchArticlesPage/>}/>}/>
      <Route exact path={Pages.SEARCH_BY_LETTER_PAGE}
             render={() => <DefaultLayout render={() => <LetterPageArticles/>}/>}/>
      <SecuredRoute exact path={Pages.UPDATE_ARTICLE_PAGE}
                    render={() => <DefaultLayout render={() => <UpdateArticlePage/>}/>}/>
      <SecuredRoute authorities={[Authority.ROOT]} exact path={Pages.CREATE_ADMIN_PAGE} render={() => <DefaultLayout hideDictionaryComponents
                                                                            render={() =>
                                                                              <CreateAdminPage/>}/>}/>
      <Route exact path={Pages.ARTICLE_PAGE} render={() => <DefaultLayout render={() => <DictionaryArticlePage/>}/>}/>
      <SecuredRoute exact path={Pages.CREATE_ARTICLE_PAGE} render={() => <DefaultLayout render={() => <AddArticlePage/>}/>}/>
      <SecuredRoute exact path={Pages.UPLOAD_FILE_PAGE} render={() => <DefaultLayout render={() => <UploadFile/>}/>}/>
      <Route exact path={Pages.LOGIN_PAGE} render={() => <DefaultLayout hideDictionaryComponents render={() => <LoginPage/>}/> } />
      <Route exact path={Pages.LOGOUT_PAGE} render={() => <Logout />} />
      <Route exact path="/" render={() => <DefaultLayout render={() => <SearchWordPage/>}/>}/>
    </Switch>
  );
};