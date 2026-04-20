import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_remove_quizquestion_choices_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="quiz",
            name="cloned_from",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="clones",
                to="core.quiz",
            ),
        ),
    ]
