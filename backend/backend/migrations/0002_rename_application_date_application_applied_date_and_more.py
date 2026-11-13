import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


def copy_job_owner(apps, schema_editor):
    Job = apps.get_model('backend', 'Job')

    for job in Job.objects.all().iterator():
        # In the old migration, created_at was a ForeignKey to the User model.
        # Copy that user ID into the new created_by field before removing it.
        job.created_by_id = job.created_at_id
        job.save(update_fields=['created_by'])


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name='application',
            old_name='application_date',
            new_name='applied_date',
        ),
        migrations.AddField(
            model_name='application',
            name='cover_letter',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='application',
            name='resume',
            field=models.FileField(blank=True, null=True, upload_to='resumes/'),
        ),
        migrations.AddField(
            model_name='job',
            name='created_by',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='posted_jobs',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='application',
            name='applicant',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='applications',
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name='application',
            name='job',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name='applications',
                to='backend.job',
            ),
        ),

        # Preserve the old Job owner before replacing the old created_at FK.
        migrations.RunPython(
            copy_job_owner,
            migrations.RunPython.noop,
        ),
        migrations.RemoveField(
            model_name='job',
            name='created_at',
        ),
        migrations.AddField(
            model_name='job',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='job',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),

        migrations.AlterField(
            model_name='job',
            name='salary_range',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterUniqueTogether(
            name='application',
            unique_together={('job', 'applicant')},
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                (
                    'id',
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name='ID',
                    ),
                ),
                (
                    'role',
                    models.CharField(
                        choices=[
                            ('seeker', 'Job Seeker'),
                            ('recruiter', 'Recruiter'),
                        ],
                        default='seeker',
                        max_length=20,
                    ),
                ),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                (
                    'user',
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='profile',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]