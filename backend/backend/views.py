
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

from django.shortcuts import get_object_or_404

from .models import Job, Application, UserProfile
from .serializers import JobSerializer, ApplicationSerializer, RegisterSerializer


# 1. Get all jobs
@api_view(['GET'])
def job_list(request):

    jobs = Job.objects.all().order_by('-posted_date')

    serializer = JobSerializer(jobs, many=True)

    return Response(serializer.data)


# 2. Get single job
@api_view(['GET'])
def job_detail(request, pk):

    job = get_object_or_404(Job, pk=pk)

    serializer = JobSerializer(job)

    return Response(serializer.data)


# 3. Create job
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):

    serializer = JobSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(created_by=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# 4. Update job
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_job(request, pk):

    job = get_object_or_404(Job, pk=pk)

    if job.created_by != request.user:
        return Response(
            {"error": "You cannot update this job"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = JobSerializer(
        job,
        data=request.data,
        partial=request.method == 'PATCH'
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


# 5. Delete job
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, pk):

    job = get_object_or_404(Job, pk=pk)

    if job.created_by != request.user:
        return Response(
            {"error": "You cannot delete this job"},
            status=status.HTTP_403_FORBIDDEN
        )

    job.delete()

    return Response(
        {"message": "Job deleted successfully"}
    )


# 6. Apply for job
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_job(request, pk):

    job = get_object_or_404(Job, pk=pk)

    if Application.objects.filter(
        job=job,
        applicant=request.user
    ).exists():

        return Response(
            {"error": "You already applied for this job"},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ApplicationSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            job=job,
            applicant=request.user
        )

        return Response(
            {
                "message": "Job applied successfully",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=400)


# 7. My applications
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):

    applications = Application.objects.filter(
        applicant=request.user
    ).order_by('-applied_date')

    serializer = ApplicationSerializer(
        applications,
        many=True
    )

    return Response(serializer.data)

# 8. User registration view
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response({
            "message": "Registration successful",
            "username": user.username,
            "email": user.email
        }, status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )
    
# 9. User login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user is not None:

        token, created = Token.objects.get_or_create(user=user)

        profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={'role': 'seeker'}
)

        role = profile.role

        return Response({
            "message": "Login successful",
            "token": token.key,
            "username": user.username,
            "email": user.email,
            "role": role
        }, status=status.HTTP_200_OK)

    return Response({
        "error": "Invalid username or password"
    }, status=status.HTTP_401_UNAUTHORIZED)