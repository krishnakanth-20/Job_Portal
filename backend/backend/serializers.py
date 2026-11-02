
from rest_framework import serializers
from .models import Job, Application


class JobSerializer(serializers.ModelSerializer):

    created_by = serializers.ReadOnlyField(
        source='created_by.username'
    )

    class Meta:
        model = Job
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):

    applicant_name = serializers.ReadOnlyField(
        source='applicant.username'
    )

    job_title = serializers.ReadOnlyField(
        source='job.title'
    )

    class Meta:
        model = Application
        fields = '__all__'

        read_only_fields = [
            'applicant',
            'status',
            'applied_date'
        ]
