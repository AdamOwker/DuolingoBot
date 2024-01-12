# import necessary modules
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from time import sleep
from google.cloud import translate
from Seqmatch import similarity, apostrophe_checker
from html.parser import HTMLParser
from sys import exit
import os

# set global vars
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "Avid_influence.json"
driver = webdriver
api_key = 'AIzaSyAdiQFUXy5Dgr4coKTWwWJllIM5oVRUruc'
signIn = 'sign-in-btn'
gotoUsername = 'top_login'
gotoPassword = 'top_password'
wrongChallenges = []
startpractice = 'Strengthen skills'
untimed = '_1pp2C'
timed = '_3XJPq'
translate_client = translate.Client()
h = HTMLParser()
targLang = ''
rerun = 'yes'


def welcome():
    print( "Welcome to my pain!")
    sleep(1)
    print( "Lets finish this, please?")
    sleep(1)
    print( "Launching page...")
    global driver
    chrome_options = Options()
    chrome_options.add_experimental_option('prefs', {
        'credentials_enable_service': False,
        'profile': {
            'password_manager_enabled': False
        }
    })
    chrome_options.add_argument('disable-infobars')
    driver = driver.Chrome(chrome_options=chrome_options)
    driver.implicitly_wait(5)
    driver.maximize_window()
    driver.get("https://www.duolingo.com")

def setup():
    username = "NO!"
    password = "THISISNOTFORYOU!"
    clickLogin = driver.find_element_by_css_selector('button[data-test="have-account"]')
    clickLogin.click()
    print( "Logging in...")
    uField = driver.find_element_by_css_selector('input[data-test="email-input"]')
    uField.clear()
    uField.send_keys(username)
    pField = driver.find_element_by_css_selector('input[data-test="password-input"]')
    pField.clear()
    pField.send_keys(password)
    driver.execute_script("document.evaluate('//button[@class=\"_3CBig _30qMV _2N_A5 _36Vd3 _16r-S _2oW4v\"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();")


def skill_or_practice():
	print("Do you want to do (A)skills or (B)")
	target = input("> ")
	if target.lower() == "a":
		driver.get('https://duolingo.com/practice')
	elif target.lower() == "b":
		skill_or_practice()
	else:
		print("choose a valid option.")
		skill_or_practice()

def finished_Lesson():
    print( "We made it! Yay!")
    print( "Loading reset")
    driver.get("https://duolingo.com")

    sleep(3)



# Commands listed here.
if __name__ == "__main__":
	welcome()
	setup()
	while (rerun == 'yes'):
	    try:
	        skill_or_practice()
	        rerun = input("Run again? Type yes or no: ")
	    except Exception as e:
	        raise e
	        break
	print( "Closing down the window...")
	sleep(1)
	driver.quit()
