from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User , UserHistory
from .serializers import UserSerializer , UserHistorySerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
#from .models import SymptomRecord
from rest_framework.permissions import IsAuthenticated
from .serializers import SymptomSerializer
from langchain_ollama import OllamaLLM
#from services.gmap_service import find_nearby_doctors
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
# accounts/views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .models import Feedback
from .serializers import FeedbackSerializer
import json
import re



llm = OllamaLLM(model = "medical-phi3")

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# User Registration
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# User Login with JWT
class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            print(user)
            print("admin check :", user.is_superuser)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role,
                "is_admin": user.is_superuser 
            })
        return Response({"error": "Invalid credentials"}, status=400)


class PredictDiseaseView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        # Step 1: Validate incoming data
        
        serializer = SymptomSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            symptoms = serializer.validated_data['symptoms']
            location = serializer.validated_data['location']
            
            
            # Step 2: Predict disease using LLM
            prompt = f'''Patient symptoms: {symptoms}.What is the possible disease and which doctor should they consult?
            
                        Given the symptoms provided, respond ONLY in a valid JSON format with two keys:
                    - predicted_disease (string)
                    - recommended_doctor (string)
                    Do NOT include explanations, markdown, or extra text. 
                    #Example:
                    {{
                    "predicted_disease": "fever",
                   "recommended_doctor": "General Physician"
                    }}'''
           

            model_response = llm.invoke(prompt)
            print("LLM RESPONSE:" ,model_response)
            print("type of LLM Response:",type( model_response))
            clean_response = model_response.strip()

            # Remove Markdown code fences if present
            if clean_response.startswith("```"):
                clean_response = re.sub(r"^```[a-zA-Z]*\n?", "", clean_response)
                clean_response = re.sub(r"```$", "", clean_response).strip()
            clean_response = clean_response.replace("/", " or ")
            clean_response = re.sub(r",\s*([}\]])", r"\1", clean_response)
            print("Cleaned LLM Response:", clean_response)
            res_data = json.loads(clean_response)
            print(type(res_data))
            print(res_data["predicted_disease"])   # Skin Infection or Acne
            print(res_data["recommended_doctor"])

            predicted_disease = res_data["predicted_disease"]
            recommended_doctor = res_data["recommended_doctor"]
            history = UserHistory.objects.create(
                user=user,
                symptoms=symptoms,
                predicted_disease=predicted_disease,
                recommended_doctor=recommended_doctor,
                location=location
            ) 

            # Step 3: Search nearby doctors via Google Maps API
            #doctors_list = find_nearby_doctors(location, recommended_doctor)

            # Step 4: Save to DB
            #record = SymptomRecord.objects.create(
            #    symptoms=symptoms,
            #    predicted_disease=predicted_disease,
            #    recommended_doctor=recommended_doctor
            #)

            # Step 5: Return response to frontend
            return Response({
                "predicted_disease": predicted_disease,
                "recommended_doctor": recommended_doctor,
                "nearby_doctors": "doctors_list",
                "history_id": history.id
            }, status=status.HTTP_200_OK)
            
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user is not None:
        # return success with dummy token (later use JWT)
        return Response({"message": "Login successful", "token": "abc123"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
# Signup
@api_view(['POST'])
def signup(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()
    return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

# Save Query History API
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_history(request):
    user = request.user
    symptoms = request.data.get("symptoms")
    predicted_disease = request.data.get("predicted_disease")
    location = request.data.get("location")
    recommended_doctor = request.data.get("recommended_doctor")

    history = UserHistory.objects.create(
        user=user,
        symptoms=symptoms,
        predicted_disease=predicted_disease,
        recommended_doctor=recommended_doctor,
        location=location
    )
    serializer = UserHistorySerializer(history)
    return Response(serializer.data)


# Fetch User History
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    history = UserHistory.objects.filter(user=user).values("symptoms", "predicted_disease","recommended_doctor", "created_at")

    return Response({
        "username": user.username,
        "email": user.email,
        "history": list(history)
    })
    
    
    
# Admin-only: List all users
class AdminUserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
# Admin-only: View history of a single user
class AdminUserHistoryView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, user_id):
        history = UserHistory.objects.filter(user_id=user_id)
        serializer = UserHistorySerializer(history, many=True)
        return Response(serializer.data)


# Admin-only: Delete a history record
class AdminDeleteHistoryView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, history_id):
        try:
            history = UserHistory.objects.get(id=history_id)
            history.delete()
            return Response({"detail": "History deleted successfully"}, status=status.HTTP_200_OK)
        except UserHistory.DoesNotExist:
            return Response({"detail": "History not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AdminDeleteUserView(APIView):
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# Users can submit feedback
class FeedbackCreateView(generics.CreateAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Admin can view all feedback
class FeedbackListView(generics.ListAPIView):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Feedback.objects.filter(user_id=user_id)