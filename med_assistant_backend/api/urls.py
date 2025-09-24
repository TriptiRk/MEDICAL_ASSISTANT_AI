
from django.urls import path
from django.urls import path
from .views import RegisterView, LoginView ,signup , user_profile
from .views import PredictDiseaseView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
from .views import AdminUserListView, AdminUserHistoryView, AdminDeleteHistoryView,CustomTokenObtainPairView, AdminDeleteUserView,FeedbackCreateView, FeedbackListView



urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path("predict/", PredictDiseaseView.as_view() , name="predict"),
    path('login/', CustomTokenObtainPairView.as_view(), name='custom_token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('signup/', views.signup, name='signup'),
    path("profile/", user_profile, name="user_profile"),
    path("admin/users/", AdminUserListView.as_view(), name="admin-users"),
    path("admin/users/<int:user_id>/history/", AdminUserHistoryView.as_view(), name="admin-user-history"),
    path("admin/users/<int:user_id>/delete/", views.AdminDeleteUserView.as_view(), name="admin_delete_user"),
    path("admin/history/<int:history_id>/delete/", AdminDeleteHistoryView.as_view(), name="admin-delete-history"),
    path('feedback/submit/', FeedbackCreateView.as_view(), name='submit_feedback'),
    path('admin/users/<int:user_id>/feedback/', FeedbackListView.as_view()),
]
