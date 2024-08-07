import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:intl/intl.dart';
import 'package:meet_chat/components/AppHeader.dart';
import 'package:meet_chat/components/BottomAppBarComponent.dart';
import 'package:meet_chat/components/ErrorMessageWidget.dart';
import 'package:meet_chat/core/globals.dart';
import 'package:meet_chat/core/models/FileMetadata.dart';
import 'package:meet_chat/core/models/Notification.dart';
import 'package:meet_chat/core/models/UserModel.dart';
import 'package:meet_chat/core/providers/UserProvider.dart';
import 'package:meet_chat/core/services/DatabaseService.dart';
import 'package:meet_chat/core/services/NotificationService.dart';
import 'package:meet_chat/core/services/StorageService.dart';
import 'package:meet_chat/routes/ChatScreen.dart';
import 'package:meet_chat/core/services/PresenceService.dart';

class UserProfile extends ConsumerStatefulWidget {
  static const String route = "profile";

  final String userId;

  const UserProfile({super.key, required this.userId});

  @override
  _UserProfileState createState() => _UserProfileState();
}

class _UserProfileState extends ConsumerState<UserProfile> {
  UserModel? user;
  bool isLoading = true;
  String errorMessage = '';
  List<FileMetadata> userPhotos = [];
  bool isSelectionMode = false;
  Set<String> selectedPhotos = Set<String>();
  String selectionError = '';
  bool isFriend = false; // Track friendship status

  final IDatabaseService _databaseService = INJECTOR<IDatabaseService>();
  final INotificationService _notificationService =
  INJECTOR<INotificationService>();
  final IStorageService _storageService = StorageService();
  final User? currentUser = FirebaseAuth.instance.currentUser;

  bool get isUserProfileOwner => currentUser?.uid == widget.userId;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    try {
      final databaseResponse = await _databaseService.getUser(widget.userId);
      if (databaseResponse.success == true) {
        final photosResponse =
        await _storageService.getUserPhotos(widget.userId);
        final currentUserData =
        await _databaseService.getUser(currentUser!.uid);

        if (photosResponse.success == true &&
            currentUserData.success == true) {
          // Check if the user is already a friend
          final currentUserFriends = currentUserData.data!.Friends ?? [];
          isFriend = currentUserFriends.contains(widget.userId);

          setState(() {
            user = databaseResponse.data;
            userPhotos = photosResponse.data ?? [];
            isLoading = false;
          });
        } else {
          setState(() {
            errorMessage =
                photosResponse.message ?? "Error loading user photos";
            isLoading = false;
          });
        }
      } else {
        setState(() {
          errorMessage = databaseResponse.message ?? "Error loading user data";
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = "Error loading user data: $e";
        isLoading = false;
      });
    }
  }

  Future<void> _refreshPhotos() async {
    try {
      final photosResponse =
      await _storageService.getUserPhotos(widget.userId);
      if (photosResponse.success == true) {
        setState(() {
          userPhotos = photosResponse.data ?? [];
          selectedPhotos.clear();
        });
      } else {
        setState(() {
          errorMessage = photosResponse.message ?? "Error loading user photos";
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = "Error loading user photos: $e";
      });
    }
  }

  Future<void> _deleteSelectedPhotos() async {
    try {
      for (String photoUrl in selectedPhotos) {
        await _storageService.deleteFile(photoUrl);
      }
      _refreshPhotos();
      setState(() {
        isSelectionMode = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selected photos deleted successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error deleting photos: $e')),
      );
    }
  }

  void _exitSelectionMode() {
    setState(() {
      isSelectionMode = false;
      selectedPhotos.clear();
    });
  }

  Future<void> _changeProfilePicture() async {
    if (!isUserProfileOwner) return; // Prevent changing profile picture if not the owner

    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Select from uploaded photos'),
              onTap: () {
                Navigator.pop(context);
                _showSelectProfilePictureDialog();
              },
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Upload new photo'),
              onTap: () async {
                Navigator.pop(context);
                _showImageSourceActionSheet(_handleProfilePictureUpload);
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _sendFriendRequest() async {
    if (currentUser == null || user == null) return;

    final senderId = currentUser!.uid;
    final recipientId = widget.userId;
    final senderUsername =
        ref.read(userProvider).username ?? currentUser!.displayName ?? 'Someone';

    final response = await _notificationService.createNotification(
      senderId,
      recipientId,
      '$senderUsername has sent you a friend request',
      NotificationType.friendRequest,
    );

    if (response.success == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Friend request sent successfully')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Failed to send friend request: ${response.message}')),
      );
    }
  }

  Future<void> _removeFriend() async {
    bool? confirmed = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Remove Friend'),
          content: const Text('Do you want to remove this friend?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Remove'),
            ),
          ],
        );
      },
    );

    if (confirmed == true) {
      try {
        final response = await _databaseService.removeFriend(currentUser!.uid, widget.userId);
        if (response.success == true) {
          if (mounted) { // Check if the widget is still mounted
            setState(() {
              // Update the UI if the removal was successful
              // This could involve removing the user from a local list of friends or similar
            });
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Friend removed successfully')),
            );
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to remove friend: ${response.message}')),
            );
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error removing friend: $e')),
          );
        }
      }
    }
  }

  Future<void> _handleProfilePictureUpload(File file) async {
    final uploadResponse = await _storageService.uploadFile(
        file, 'users/${widget.userId}_photos', DateTime.now().millisecondsSinceEpoch.toString());
    if (uploadResponse.success == true) {
      final updateResponse = await _databaseService.updateProfilePicture(
          widget.userId, uploadResponse.data!.url);
      if (updateResponse.success == true) {
        await currentUser?.updatePhotoURL(uploadResponse.data!.url); // Update Firebase profile picture URL
        ref.read(userProvider.notifier).setProfilePictureUrl(uploadResponse.data!.url); // Update UserProvider
        setState(() {
          user!.ProfilePictureUrl = uploadResponse.data!.url;
        });
        await _refreshPhotos(); // Refresh photos after successful profile picture upload
      } else {
        setState(() {
          errorMessage = updateResponse.message ?? "Error updating profile picture";
        });
      }
    } else {
      setState(() {
        errorMessage = uploadResponse.message ?? "Error uploading profile picture";
      });
    }
  }

  Future<void> _showImageSourceActionSheet(Function(File) onImagePicked) async {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Choose from Gallery'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final picker = ImagePicker();
                  final pickedFile =
                  await picker.pickImage(source: ImageSource.gallery);
                  if (pickedFile != null) {
                    onImagePicked(File(pickedFile.path));
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Take a Photo'),
                onTap: () async {
                  Navigator.of(context).pop();
                  final picker = ImagePicker();
                  final pickedFile =
                  await picker.pickImage(source: ImageSource.camera);
                  if (pickedFile != null) {
                    onImagePicked(File(pickedFile.path));
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showSelectProfilePictureDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Select Profile Picture'),
          content: Container(
            width: double.maxFinite,
            height: 300,
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
              ),
              itemCount: userPhotos.length,
              itemBuilder: (context, index) {
                final photo = userPhotos[index];
                return GestureDetector(
                  onTap: () async {
                    final updateResponse = await _databaseService
                        .updateProfilePicture(widget.userId, photo.url);
                    if (updateResponse.success == true) {
                      await currentUser?.updatePhotoURL(photo.url); // Update Firebase profile picture URL
                      ref.read(userProvider.notifier).setProfilePictureUrl(photo.url); // Update UserProvider
                      setState(() {
                        user!.ProfilePictureUrl = photo.url;
                      });
                      Navigator.pop(context);
                      await _refreshPhotos(); // Refresh photos after successful profile picture update
                    } else {
                      setState(() {
                        errorMessage =
                            updateResponse.message ?? "Error updating profile picture";
                      });
                      Navigator.pop(context);
                    }
                  },
                  child: Image.network(
                    photo.url,
                    fit: BoxFit.cover,
                  ),
                );
              },
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  void _showEditModal() {
    TextEditingController usernameController =
    TextEditingController(text: user?.Username);
    TextEditingController firstNameController =
    TextEditingController(text: user?.FirstName);
    TextEditingController lastNameController =
    TextEditingController(text: user?.LastName);
    TextEditingController phoneController =
    TextEditingController(text: user?.PhoneNumber);
    TextEditingController emailController =
    TextEditingController(text: user?.Email);
    TextEditingController aboutMeController =
    TextEditingController(text: user?.AboutMe);
    DateTime? selectedDate = user?.DateOfBirth;

    void _pickDateOfBirth(BuildContext context) async {
      final DateTime? picked = await showDatePicker(
        context: context,
        initialDate: selectedDate ?? DateTime(2000),
        firstDate: DateTime(1900),
        lastDate: DateTime.now(),
      );
      if (picked != null && picked != selectedDate) {
        setState(() {
          selectedDate = picked;
        });
      }
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16.0,
            right: 16.0,
            top: 16.0,
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Edit Profile',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: usernameController,
                  decoration: const InputDecoration(labelText: 'Username'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: firstNameController,
                  decoration: const InputDecoration(labelText: 'First Name'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: lastNameController,
                  decoration: const InputDecoration(labelText: 'Last Name'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(labelText: 'Phone'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: aboutMeController,
                  maxLines: null,
                  decoration: const InputDecoration(labelText: 'About Me'),
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () => _pickDateOfBirth(context),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        vertical: 15, horizontal: 10),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          selectedDate == null
                              ? 'Select Date of Birth'
                              : DateFormat('dd.MM.yyyy').format(selectedDate!),
                          style: const TextStyle(fontSize: 16),
                        ),
                        ShaderMask(
                          shaderCallback: (Rect bounds) {
                            return LinearGradient(
                              colors: [Color(0xFFFF5F6D), Colors.pinkAccent],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ).createShader(bounds);
                          },
                          child: const Icon(
                            Icons.calendar_today,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFFFF5F6D), Colors.pinkAccent],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                        ),
                        child: TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text(
                            'Cancel',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFFFF5F6D), Colors.pinkAccent],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.all(Radius.circular(12)),
                        ),
                        child: ElevatedButton(
                          onPressed: () async {
                            Navigator.pop(context);
                            await _updateUserProfile(
                              usernameController.text,
                              firstNameController.text,
                              lastNameController.text,
                              phoneController.text,
                              emailController.text,
                              aboutMeController.text,
                              selectedDate,
                            );
                          },
                          child: const Text('Save'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            shadowColor: Colors.transparent,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _updateUserProfile(
      String username,
      String firstName,
      String lastName,
      String phone,
      String email,
      String aboutMe,
      DateTime? dateOfBirth,
      ) async {
    if (user == null) return;

    user!.Username = username;
    user!.FirstName = firstName;
    user!.LastName = lastName;
    user!.PhoneNumber = phone;
    user!.Email = email;
    user!.AboutMe = aboutMe;
    user!.DateOfBirth = dateOfBirth;

    final response =
    await _databaseService.updateUserData(widget.userId, user!);
    if (response.success == true) {
      await currentUser?.updateDisplayName(username);
      ref.read(userProvider.notifier).setUsername(username);
      setState(() {});
    } else {
      setState(() {
        errorMessage = response.message ?? "Error updating user data";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppHeader(
        title: "${user?.Username}'s Profile",
      ),
      body: Container(
        color: const Color(0xFFF0F0F0),
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : errorMessage.isNotEmpty
            ? Center(child: Text(errorMessage))
            : Column(
          children: [
            if (selectionError.isNotEmpty)
              ErrorMessageWidget(
                message: selectionError,
                type: MessageType.error,
                canClose: true,
              ),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    _buildHeader(),
                    _buildCard(_buildUserInfo(), "User Info"),
                    _buildCard(_buildAdditionalInfo(), "About Me"),
                    _buildCard(_buildPhotoGallery(), "Photos"),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomAppBarComponent(
        buttons: [
          buildIconButton(
            icon: Icons.home,
            startColor: const Color.fromRGBO(43, 217, 254, 1.0),
            endColor: Colors.lightBlueAccent,
            onPressed: () {
              Navigator.pop(context);
            },
          ),
          buildIconButton(
            icon: isFriend ? Icons.close : Icons.person_add,
            startColor: const Color(0xFFFF5F6D),
            endColor: Colors.pinkAccent,
            onPressed: isFriend ? _removeFriend : _sendFriendRequest,
          ),
          buildIconButton(
            icon: Icons.message,
            startColor: Colors.red,
            endColor: Colors.deepOrange,
            onPressed: () {
              Navigator.pushNamed(context, ChatScreen.route,
                  arguments: user?.Id ?? '');
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    final userState = ref.watch(userProvider);
    final displayName = userState.username ?? user!.Username;

    return Container(
      height: 300,
      decoration: BoxDecoration(
        image: DecorationImage(
          image: NetworkImage(user!.ProfilePictureUrl),
          fit: BoxFit.cover,
        ),
      ),
      child: Stack(
        children: [
          Align(
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                '$displayName, ${user!.calculateAge() ?? ''}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  backgroundColor: Colors.black54,
                ),
              ),
            ),
          ),
          if (isUserProfileOwner)
            Positioned(
              bottom: 16,
              right: 16,
              child: IconButton(
                icon: const Icon(Icons.edit, color: Colors.white, size: 30),
                onPressed: _changeProfilePicture,
              ),
            ),
          Positioned(
            top: 16,
            right: 16,
            child: StreamBuilder<String>(
              stream: UserPresenceService().getPresenceStream(widget.userId),
              builder: (context, snapshot) {
                final presence = snapshot.data ?? 'offline';
                return Container(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 6,
                        backgroundColor:
                        presence == 'online' ? Colors.green : Colors.red,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        presence == 'online' ? 'Online' : 'Offline',
                        style: const TextStyle(color: Colors.black),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCard(Widget content, String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
      child: Card(
        color: Colors.white,
        shape:
        RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
        elevation: 5,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.pinkAccent,
                    ),
                  ),
                  if (isUserProfileOwner &&
                      (title == "User Info" || title == "About Me"))
                    IconButton(
                      icon: const Icon(Icons.edit, color: Colors.pinkAccent),
                      onPressed: _showEditModal,
                    ),
                  if (isSelectionMode && title == "Photos")
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.pinkAccent),
                      onPressed: _exitSelectionMode,
                    ),
                ],
              ),
              const SizedBox(height: 8),
              content,
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfo() {
    final userState = ref.watch(userProvider);
    final displayName = userState.username ?? user!.Username;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildUserInfoRow(Icons.person, "Username: $displayName"),
        if (user!.FirstName != null && user!.LastName != null)
          _buildUserInfoRow(
              Icons.person, "Name: ${user!.FirstName} ${user!.LastName}"),
        if (user!.PhoneNumber != null)
          _buildUserInfoRow(Icons.phone, "Phone: ${user!.PhoneNumber}"),
        _buildUserInfoRow(Icons.email, "Email: ${user!.Email}"),
        _buildUserInfoRow(Icons.cake, "Age: ${user!.calculateAge() ?? ''}"),
        if (user!.DateOfBirth != null)
          _buildUserInfoRow(Icons.calendar_today,
              "Date of Birth: ${_formatDate(user!.DateOfBirth!)}"),
      ],
    );
  }

  Widget _buildUserInfoRow(IconData icon, String info) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.pinkAccent),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              info,
              style: const TextStyle(fontSize: 18),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAdditionalInfo() {
    return SizedBox(
      width: double.infinity,
      child: Text(
        user!.AboutMe ?? "No additional information",
        style: const TextStyle(fontSize: 16),
      ),
    );
  }

  Widget _buildPhotoGallery() {
    return Column(
      children: [
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemCount:
          isUserProfileOwner ? userPhotos.length + 1 : userPhotos.length,
          itemBuilder: (context, index) {
            if (isUserProfileOwner && index == userPhotos.length) {
              return GestureDetector(
                onTap: () async {
                  _showImageSourceActionSheet(_handlePhotoUpload);
                },
                child: Container(
                  color: Colors.grey[200],
                  child: const Center(
                    child: Icon(
                      Icons.add,
                      size: 50,
                      color: Colors.pinkAccent,
                    ),
                  ),
                ),
              );
            }
            final photo = userPhotos[index];
            final isSelected = selectedPhotos.contains(photo.url);
            return GestureDetector(
              onTap: () {
                if (isSelectionMode) {
                  setState(() {
                    if (photo.url == user!.ProfilePictureUrl) {
                      selectionError = "Profile picture cannot be deleted.";
                    } else {
                      selectionError = '';
                      if (isSelected) {
                        selectedPhotos.remove(photo.url);
                      } else {
                        selectedPhotos.add(photo.url);
                      }
                    }
                  });
                } else {
                  _showPhotoDialog(photo.url);
                }
              },
              onLongPress: () {
                if (isUserProfileOwner) {
                  if (photo.url != user!.ProfilePictureUrl) {
                    setState(() {
                      isSelectionMode = true;
                      selectedPhotos.add(photo.url);
                    });
                  } else {
                    setState(() {
                      selectionError = "Profile picture cannot be deleted.";
                    });
                  }
                }
              },
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      photo.url,
                      fit: BoxFit.cover,
                    ),
                  ),
                  if (isSelectionMode)
                    Positioned(
                      top: 8,
                      right: 8,
                      child: Icon(
                        isSelected
                            ? Icons.check_circle
                            : Icons.radio_button_unchecked,
                        color: Colors.pinkAccent,
                      ),
                    ),
                ],
              ),
            );
          },
        ),
        if (isSelectionMode)
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: selectedPhotos.isEmpty ? null : _deleteSelectedPhotos,
              child: const Text('Delete Selected Photos'),
              style: ElevatedButton.styleFrom(
                foregroundColor: Colors.white,
                backgroundColor: Colors.red, // Text color
              ),
            ),
          ),
      ],
    );
  }

  Future<void> _handlePhotoUpload(File file) async {
    final uploadResponse = await _storageService.uploadFile(
        file, 'users/${widget.userId}_photos', DateTime.now().millisecondsSinceEpoch.toString());
    if (uploadResponse.success == true) {
      setState(() {
        userPhotos.add(uploadResponse.data!);
      });
    } else {
      setState(() {
        errorMessage = uploadResponse.message ?? "Error uploading photo";
      });
    }
  }

  void _showPhotoDialog(String photoUrl) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(0),
          child: Stack(
            children: [
              Positioned.fill(
                child: Image.network(
                  photoUrl,
                  fit: BoxFit.contain,
                ),
              ),
              Positioned(
                top: 20,
                right: 20,
                child: IconButton(
                  icon: const Icon(Icons.close, color: Colors.white, size: 30),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _formatDate(DateTime date) {
    return "${date.day}.${date.month}.${date.year}";
  }
}
