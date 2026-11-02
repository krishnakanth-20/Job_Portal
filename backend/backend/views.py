
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer


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
