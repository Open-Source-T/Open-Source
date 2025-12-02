"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from ai_health_care import views


def api_root(request):
    return JsonResponse(
        {
            'message': 'AI Health Care API',
            'endpoints': {
                'sign_up': '/api/sign-up/',
                'login': '/api/login/',
                'logout': '/api/logout/',
                'upload': '/api/upload/',
                'record': '/api/record/',
            },
        }
    )


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api_root'),
    # API (JSON)
    path('api/sign-up/', views.api_sign_up, name='api_sign_up'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/logout/', views.api_logout, name='api_logout'),
    path('api/upload/', views.api_upload, name='api_upload'),
    path('api/record/', views.api_record, name='api_record'),
]
