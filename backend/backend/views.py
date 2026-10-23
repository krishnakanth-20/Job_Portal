from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serilaizers import RegisterSerializer
from django.contrib.auth.models import User


@api_view(['GET'])
def hello_api(request):
    return Response({'message': 'Hello, API!'})

@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save() # save user data to the database
        return Response({'message': 'User registered successfully!'},status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def login_user(request):
    user_name = request.data.get("username")
    password = request.data.get("password") 
    
    try:
        user = User.objects.get(username=user_name,password=password)
        return Response({"message": "User logged in successfully!"},status=200)
    except User.DoesNotExist:
        return Response({"message": "Invalid username or password."},status=400)