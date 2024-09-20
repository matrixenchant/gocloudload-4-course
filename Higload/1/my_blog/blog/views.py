from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from .models import Post

from django.shortcuts import render, redirect
from .forms import PostForm, CommentForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.core.paginator import Paginator

def helloWorld(request):
    return HttpResponse("Hello, Blog!")

def posts_list(request):
    posts = Post.objects.all().order_by('-created_at')  # Сортировка по дате создания
    paginator = Paginator(posts, 5)  # Показывать 5 постов на странице

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'posts_list.html', {'page_obj': page_obj})

def post_details(request, id):
    post = get_object_or_404(Post, id=id)
    comments = post.comments.all()

    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.post = post
            new_comment.author = request.user
            new_comment.save()
            return redirect('post_details', id=post.id)
    else:
        comment_form = CommentForm()

    print(request.user.username == post.author)
    return render(request, 'post_details.html', {'post': post, 'is_owner': post.author == request.user.username and post.author != '', 'comments': comments, 'comment_form': comment_form})

@login_required
def create_post(request):

    print(request.user.username)

    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user.username
            post.save()
            return redirect('posts_list')
    else:
        form = PostForm()

    return render(request, 'create_post.html', {'form': form})

@login_required
def edit_post(request, id):
    post = get_object_or_404(Post, id=id)

    print(request.user.username)

    if request.user.username != post.author:
        return redirect('posts_list')

    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect('post_details', id=post.id)
    else:
        form = PostForm(instance=post)

    return render(request, 'edit_post.html', {'form': form, 'post': post})

@login_required
def delete_post(request, id):
    post = get_object_or_404(Post, id=id)

    if request.user.username != post.author:
        return redirect('posts_list')

    if request.method == 'POST':
        post.delete()
        return redirect('posts_list')

    return render(request, 'delete_post.html', {'post': post})



def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})