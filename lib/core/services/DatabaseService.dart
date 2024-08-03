import 'package:cloud_firestore/cloud_firestore.dart' show DocumentSnapshot, FieldPath, Query, Timestamp;
import 'package:meet_chat/core/globals.dart';
import 'package:meet_chat/core/models/ServiceResponse.dart';
import 'package:meet_chat/core/models/UserModel.dart';

abstract class IDatabaseService {
  Future<ServiceResponse<bool>> createUser(String id, UserModel user);
  Future<ServiceResponse<UserModel>> getUser(String id);
  Future<ServiceResponse<List<UserModel>>> getAllUsers({int limit, DocumentSnapshot? lastDocument});
  Future<ServiceResponse<List<UserModel>>> getFriends({int limit = 10, DocumentSnapshot? lastDocument, String? userId});
  Future<ServiceResponse<List<UserModel>>> searchUsers({String? username, List<Gender>? genders, int? minAge, int? maxAge});
  Future<ServiceResponse<bool>> updateUserData(String id, UserModel user);
  Future<ServiceResponse<bool>> updateProfilePicture(String id, String profilePictureUrl);
  Future<ServiceResponse<void>> addFriend(String userId, String friendId);
}

class DatabaseService implements IDatabaseService {
  @override
  Future<ServiceResponse<bool>> createUser(String id, UserModel user) async {
    try {
      user.calculateAge();

      await FIREBASE_FIRESTORE.collection("users").doc(id).set({
        "username": user.Username,
        "firstName": user.FirstName,
        "lastName": user.LastName,
        "email": user.Email,
        "profilePictureUrl": user.ProfilePictureUrl,
        "gender": _genderToString(user.UserGender),
        "phoneNumber": user.PhoneNumber,
        "friends": user.Friends,
        "aboutMe": user.AboutMe,
        "dateOfBirth": user.DateOfBirth != null ? Timestamp.fromDate(user.DateOfBirth!) : null,
      });

      return ServiceResponse<bool>(data: true, success: true);
    } on Exception catch (err) {
      return ServiceResponse<bool>(
          data: false, message: err.toString(), success: false);
    }
  }

  @override
  Future<ServiceResponse<UserModel>> getUser(String id) async {
    try {
      final docSnapshot = await FIREBASE_FIRESTORE.collection("users").doc(id).get();

      if (docSnapshot.exists) {
        final user = UserModel.fromDocument(docSnapshot);
        return ServiceResponse<UserModel>(data: user, success: true);
      } else {
        return ServiceResponse<UserModel>(
            message: "User not found", success: false);
      }
    } on Exception catch (err) {
      return ServiceResponse<UserModel>(
          message: err.toString(), success: false);
    }
  }

  @override
  Future<ServiceResponse<List<UserModel>>> getAllUsers({int limit = 10, DocumentSnapshot? lastDocument}) async {
    try {
      Query query = FIREBASE_FIRESTORE.collection("users")
          .where(FieldPath.documentId, isNotEqualTo: FIREBASE_INSTANCE.currentUser?.uid).limit(limit);

      if (lastDocument != null) {
        query = query.startAfterDocument(lastDocument);
      }

      final querySnapshot = await query.get();

      if (querySnapshot.docs.isNotEmpty) {
        List<UserModel> users = [];

        for (var doc in querySnapshot.docs) {
          UserModel user = UserModel.fromDocument(doc);
          users.add(user);
        }

        return ServiceResponse<List<UserModel>>(
          data: users,
          success: true,
        );
      } else {
        return ServiceResponse<List<UserModel>>(
          message: "No users found",
          success: false,
        );
      }
    } catch (err) {
      return ServiceResponse<List<UserModel>>(
        message: err.toString(),
        success: false,
      );
    }
  }

  @override
  Future<ServiceResponse<List<UserModel>>> getFriends({int limit = 10, DocumentSnapshot? lastDocument, String? userId}) async {  try {

    final userSnapshot = await FIREBASE_FIRESTORE
        .collection("users")
        .doc(userId)
        .get();

    final List<String> friends = List<String>.from(userSnapshot.get('friends') ?? []);
    if (friends.isEmpty) {
      return ServiceResponse<List<UserModel>>(
        message: "No friends found",
        success: true,
        data: [],
      );
    }

    List<UserModel> friendUsers = [];

      Query query = FIREBASE_FIRESTORE
          .collection("users")
          .where(FieldPath.documentId, whereIn: friends)
          .limit(limit);

      if (lastDocument != null) {
        query = query.startAfterDocument(lastDocument);
      }

      final querySnapshot = await query.get();

      for (var doc in querySnapshot.docs) {
        UserModel user = UserModel.fromDocument(doc);
        friendUsers.add(user);
      }

    if (friendUsers.isNotEmpty) {
      return ServiceResponse<List<UserModel>>(
        data: friendUsers,
        success: true,
      );
    } else {
      return ServiceResponse<List<UserModel>>(
        message: "No friends found",
        success: false,
      );
    }
  } catch (err) {
    return ServiceResponse<List<UserModel>>(
      message: err.toString(),
      success: false,
    );
  }
  }

  @override
  Future<ServiceResponse<List<UserModel>>> searchUsers({String? username, List<Gender>? genders, int? minAge, int? maxAge}) async {
    try {
      Query query = FIREBASE_FIRESTORE.collection("users");

      if (username != null && username.isNotEmpty) {
        query = query.where('username', isGreaterThanOrEqualTo: username)
            .where('username', isLessThanOrEqualTo: '$username\uf8ff');
      }

      if (genders != null && genders.isNotEmpty) {
        query = query.where('gender', whereIn: genders.map((g) => _genderToString(g)).toList());
      }

      if (minAge != null) {
        query = query.where('age', isGreaterThanOrEqualTo: minAge);
      }

      if (maxAge != null) {
        query = query.where('age', isLessThanOrEqualTo: maxAge);
      }

      final querySnapshot = await query.get();

      if (querySnapshot.docs.isNotEmpty) {
        List<UserModel> users = [];

        for (var doc in querySnapshot.docs) {
          UserModel user = UserModel.fromDocument(doc);
          users.add(user);
        }

        return ServiceResponse<List<UserModel>>(
          data: users,
          success: true,
        );
      } else {
        return ServiceResponse<List<UserModel>>(
          message: "No users found",
          success: false,
        );
      }
    } catch (err) {
      return ServiceResponse<List<UserModel>>(
        message: err.toString(),
        success: false,
      );
    }
  }

  @override
  Future<ServiceResponse<bool>> updateUserData(String id, UserModel user) async {
    try {
      await FIREBASE_FIRESTORE.collection("users").doc(id).update({
        "username": user.Username,
        "firstName": user.FirstName,
        "lastName": user.LastName,
        "email": user.Email,
        "profilePictureUrl": user.ProfilePictureUrl,
        "gender": _genderToString(user.UserGender),
        "phoneNumber": user.PhoneNumber,
        "friends": user.Friends,
        "aboutMe": user.AboutMe,
        "dateOfBirth": user.DateOfBirth != null ? Timestamp.fromDate(user.DateOfBirth!) : null,
      });

      return ServiceResponse<bool>(data: true, success: true);
    } on Exception catch (err) {
      return ServiceResponse<bool>(
          data: false, message: err.toString(), success: false);
    }
  }

  @override
  Future<ServiceResponse<bool>> updateProfilePicture(String id, String profilePictureUrl) async {
    try {
      await FIREBASE_FIRESTORE.collection("users").doc(id).update({
        "profilePictureUrl": profilePictureUrl,
      });

      return ServiceResponse<bool>(data: true, success: true);
    } on Exception catch (err) {
      return ServiceResponse<bool>(
          data: false, message: err.toString(), success: false);
    }
  }

  @override
  Future<ServiceResponse<void>> addFriend(String userId, String friendId) async {
    try {
      // Add friendId to userId's friends list
      final userDoc = FIREBASE_FIRESTORE.collection("users").doc(userId);
      final userSnapshot = await userDoc.get();

      if (userSnapshot.exists) {
        final List<String> userFriends = List<String>.from(userSnapshot.get('friends') ?? []);
        if (!userFriends.contains(friendId)) {
          userFriends.add(friendId);
          await userDoc.update({"friends": userFriends});
        }
      }

      // Add userId to friendId's friends list
      final friendDoc = FIREBASE_FIRESTORE.collection("users").doc(friendId);
      final friendSnapshot = await friendDoc.get();

      if (friendSnapshot.exists) {
        final List<String> friendFriends = List<String>.from(friendSnapshot.get('friends') ?? []);
        if (!friendFriends.contains(userId)) {
          friendFriends.add(userId);
          await friendDoc.update({"friends": friendFriends});
        }
      }

      return ServiceResponse<void>(success: true);
    } on Exception catch (err) {
      return ServiceResponse<void>(message: err.toString(), success: false);
    }
  }

  String _genderToString(Gender gender) {
    return gender == Gender.Male ? 'Male' : 'Female';
  }

  Gender _genderFromString(String gender) {
    return gender == 'Male' ? Gender.Male : Gender.Female;
  }


}
