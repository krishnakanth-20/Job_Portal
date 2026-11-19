
from rest_framework import serializers
from .models import Job, Application, UserProfile
from django.contrib.auth.models import User


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
        

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        default='seeker'
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'confirmPassword',
            'role'
        ]

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError({
                'confirmPassword': 'Passwords do not match.'
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirmPassword')
        role = validated_data.pop('role')

        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role)

        return user
