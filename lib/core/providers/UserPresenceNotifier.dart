import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meet_chat/core/services/PresenceService.dart';

class UserPresenceNotifier extends StateNotifier<bool> {
  final IUserPresenceService _userPresenceService;

  UserPresenceNotifier(this._userPresenceService) : super(false);

  Future<void> setPresence(bool isOnline) async {
    _userPresenceService.setPresence(isOnline);
    state = isOnline;
  }
}

final userPresenceServiceProvider = Provider<IUserPresenceService>((ref) {
  return UserPresenceService();
});

final userPresenceNotifierProvider =
StateNotifierProvider<UserPresenceNotifier, bool>((ref) {
  final userPresenceService = ref.watch(userPresenceServiceProvider);
  return UserPresenceNotifier(userPresenceService);
});
