from django.urls import path
from .views import RegisterView, TodoListCreateView, TodoRetrieveUpdateDestroyView


urlpatterns = [
    path('signup/', RegisterView.as_view(), name='signup'),
    path('todos/', TodoListCreateView.as_view(), name='todo-list-create'),
    path('todos/<int:pk>/', TodoRetrieveUpdateDestroyView.as_view(),
         name='todo-detail'),
]
