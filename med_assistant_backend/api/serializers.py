from rest_framework import serializers
from .models import User , UserHistory, Feedback
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    
class SymptomSerializer(serializers.Serializer):
    symptoms = serializers.CharField(max_length=500)
    location = serializers.CharField(max_length=255)
    


# History Serializer
class UserHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserHistory
        fields = ['id','symptoms', 'predicted_disease','recommended_doctor', 'location', 'created_at']




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_admin'] = user.is_staff
        token['username'] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra fields in response body
        data['is_admin'] = self.user.is_staff
        data['username'] = self.user.username
        return data

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["feedback_id", "user", "is_correct", "comments", "submitted_at"]
        read_only_fields = ["feedback_id", "user", "submitted_at"]