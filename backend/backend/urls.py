
from django.urls import path

from . import views

urlpatterns = [

    path('jobs/', views.job_list, name='job_list'),

    path('jobs/create/', views.create_job, name='create_job'),

    path('jobs/<int:pk>/', views.job_detail, name='job_detail'),

    path('jobs/<int:pk>/update/', views.update_job, name='update_job'),

    path('jobs/<int:pk>/delete/', views.delete_job, name='delete_job'),

    path('jobs/<int:pk>/apply/', views.apply_job, name='apply_job'),

    path('my-applications/', views.my_applications, name='my_applications'),

]
