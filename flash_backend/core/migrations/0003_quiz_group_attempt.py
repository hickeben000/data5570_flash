from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_remove_quizquestion_choices_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="group_id",
            field=models.UUIDField(blank=True, db_index=True, null=True),
        ),
        migrations.AddField(
            model_name="quiz",
            name="attempt",
            field=models.PositiveIntegerField(default=1),
        ),
    ]
