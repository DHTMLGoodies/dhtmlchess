TestCase("UserTest", {

	setupComplete:false,
	"setUpPage":function () {


	},
	"setUp":function () {
		if (!this.setUpComplete) {
			window.chess.URL = '../../chess-controller.php';
			document.body.innerHTML = '';
			new chess.view.user.LoginButton({ els:{ parentEl:document.body } });
			new chess.view.user.RegisterButton({ els:{ parentEl:document.body } });
			new chess.view.user.LogoutButton({ els:{ parentEl:document.body } });
			new chess.view.user.Panel({ els:{ parentEl:document.body } });
			new chess.view.user.SettingsButton({ els:{ parentEl:document.body } });
			new chess.view.menuItems.GameImport({ els:{ parentEl:document.body } });
			new chess.view.menuItems.SaveGame({ els:{ parentEl:document.body } });

			window.controller = new chess.view.user.Controller();

			this.setUpComplete = true;
		}

	},

	getController:function () {
		return window.controller;
	},

	"test_should_be_able_to_register_login_button":function () {

		var controller = this.getController();

		assertNotUndefined(controller.components.registerWindow);
		assertNotUndefined(controller.components.loginWindow);
		assertNotUndefined(controller.components.loginButton);
		assertNotUndefined(controller.components.logoutButton);
		assertNotUndefined(controller.components.registerButton);
		assertNotUndefined(controller.components.menuItemGameImport);
		assertNotUndefined(controller.components.menuItemSaveGame);
	},


	"test_should_show_login_button_on_missing_session_token":function () {
		// given
		var controller = this.getController();

		// when
		controller.fireEvent('invalidSession');

		// then
		assertFalse(controller.components.loginButton.isHidden());
		assertFalse(controller.components.registerButton.isHidden());
		assertTrue(controller.components.logoutButton.isHidden());
	},

	"test_should_show_logout_button_on_valid_session_token":function () {
		// given
		var controller = this.getController();

		// when
		controller.fireEvent('invalidSession');
		controller.fireEvent('validSession');

		// then
		assertTrue(controller.components.loginButton.isHidden());
		assertTrue(controller.components.registerButton.isHidden());
		assertFalse(controller.components.logoutButton.isHidden());
	},

	"test_should_show_login_window_when_click_on_login_button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.loginButton;
		// when
		button.click();

		// then
		assertFalse(controller.components.loginWindow.isHidden());

	},

	"test_should_show_register_window_when_click_on_register_button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.registerButton;
		// when
		button.click();

		// then
		assertFalse(controller.components.registerWindow.isHidden());
	},

	"test_should_show_user_panel_on_successful_login":function () {
		// given
		var controller = this.getController();
		var loginWindow = controller.components.loginWindow;

		// when
		loginWindow.fireEvent('loginSuccess', { token:'dummy'});

		// then
		assertFalse(controller.components.userPanel.isHidden());
	},

	"test_should_show_and_hide_components_on_logout":function () {
		// given
		var controller = this.getController();
		controller.components.loginWindow.fireEvent('loginSuccess', { token:'dummy'});

		// when
		controller.components.logoutButton.click();

		// then
		assertTrue(controller.components.userPanel.isHidden());
		assertTrue(controller.components.logoutButton.isHidden());
		assertFalse(controller.components.loginButton.isHidden());
		assertFalse(controller.components.registerButton.isHidden());

	},

	"test_should_show_and_hide_components_on_registration":function () {
		// given
		var controller = this.getController();
		var registerWindow = controller.components.registerWindow;

		// when
		registerWindow.fireEvent('registerSuccess', { token:'dummy'});

		// then
		assertFalse(controller.components.userPanel.isHidden());

	},

	"test_should_show_profile_window_on_click_on_gears_button":function () {
		// given
		var controller = this.getController();
		var button = controller.components.settingsButton;
		var profileWin = controller.components.profileWindow;

		// when
		button.click();

		// then
		assertFalse(profileWin.isHidden());
	},

	"test_game_import_menu_item_should_be_initial_disabled":function () {
		// given
		var controller = this.getController();
		// when
		var menuItem = controller.components.menuItemGameImport
		// then
		assertTrue(menuItem.isDisabled());

	},

	"test_should_enable_import_game_button_on_sufficient_access":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport
		// when
		controller.fireEvent('userAccess', window.chess.UserRoles.GAME_IMPORT + window.chess.UserRoles.EDIT_FOLDERS);

		// then
		assertFalse(menuItem.isDisabled());
	},

	"test_should_enable_import_game_button_on_login":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport;
		menuItem.disable();

		// when
		controller.login({
			user_access:4095
		});
		// then
		assertFalse(menuItem.isDisabled());
	},

	"test_should_disable_import_game_button_on_logout":function () {
		// given
		var controller = this.getController();
		var menuItem = controller.components.menuItemGameImport;
		menuItem.disable();
		controller.login({
			user_access:4095
		});

		// when
		controller.logout();

		// then
		assertTrue(menuItem.isDisabled());
	},

	"getControllerWithCustomGetSessionTokenMethod":function () {
		var c = new Class({
			Extends:chess.controller.UserController,
			hasValidSession:function () {
				return false
			}
		});
		return new c({});
	}


});