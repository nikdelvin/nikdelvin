from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
import requests
import json
import os
import traceback
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def initilization_of_population(size, n_feat):
    population = []
    for i in range(size):
        chromosome = np.ones(n_feat, dtype=np.bool)
        chromosome[:int(0.3*n_feat)] = False
        np.random.shuffle(chromosome)
        population.append(chromosome)
    return population

def fitness_score(population, X_train, X_test, y_train, y_test, logmodel):
    from sklearn.metrics import r2_score
    scores = []
    for chromosome in population:
        logmodel.fit(X_train.iloc[:,chromosome],y_train)
        scores.append(logmodel.score(X_test.iloc[:,chromosome],y_test))
    scores, population = np.array(scores), np.array(population)
    inds = np.argsort(scores)
    return list(scores[inds][::-1]), list(population[inds,:][::-1])

def fitness_score_y3(population, X_train, X_test, y_train, y_test, logmodel):
    from sklearn.metrics import r2_score
    scores = []
    for chromosome in population:
        logmodel.fit(X_train.iloc[:, chromosome], y_train)
        predictions = logmodel.predict(X_test.iloc[:, chromosome])
        scores.append(r2_score(y_test, predictions))
    scores, population = np.array(scores), np.array(population)
    inds = np.argsort(scores)
    return list(scores[inds][::-1]), list(population[inds, :][::-1])

def selection(pop_after_fit, n_parents):
    population_nextgen = []
    for i in range(n_parents):
        population_nextgen.append(pop_after_fit[i])
    return population_nextgen

def crossover(pop_after_sel):
    population_nextgen = pop_after_sel
    for i in range(len(pop_after_sel)):
        child = pop_after_sel[i].copy()
        child[3:7] = pop_after_sel[(i+1) % len(pop_after_sel)][3:7]
        population_nextgen.append(child)
    return population_nextgen

def mutation(pop_after_cross, mutation_rate):
    import random
    population_nextgen = []
    for i in range(1, len(pop_after_cross)):
        chromosome = pop_after_cross[i]
        for j in range(len(chromosome)):
            if random.random() < mutation_rate:
                chromosome[j] = not chromosome[j]
        population_nextgen.append(chromosome)
    return population_nextgen

def generations(size, n_feat, n_parents, mutation_rate, n_gen, X_train, X_test, y_train, y_test, logmodel):
    best_chromo = []
    best_score = []
    population_nextgen = initilization_of_population(size, n_feat)
    for i in range(n_gen):
        scores, pop_after_fit = fitness_score(population_nextgen, X_train, X_test, y_train, y_test, logmodel)
        print(scores[:2])
        pop_after_sel = selection(pop_after_fit, n_parents)
        pop_after_cross = crossover(pop_after_sel)
        population_nextgen = mutation(pop_after_cross, mutation_rate)
        best_chromo.append(pop_after_fit[0])
        best_score.append(scores[0])
    return best_chromo, best_score

def generations_y3(size, n_feat, n_parents, mutation_rate, n_gen, X_train, X_test, y_train, y_test, logmodel):
    best_chromo = []
    best_score = []
    population_nextgen = initilization_of_population(size, n_feat)
    for i in range(n_gen):
        scores, pop_after_fit = fitness_score_y3(population_nextgen, X_train, X_test, y_train, y_test, logmodel)
        print(scores[:2])
        pop_after_sel = selection(pop_after_fit, n_parents)
        pop_after_cross = crossover(pop_after_sel)
        population_nextgen = mutation(pop_after_cross, mutation_rate)
        best_chromo.append(pop_after_fit[0])
        best_score.append(scores[0])
    return best_chromo, best_score

def Api(request):
    if request.path == "/api/ping/":
        try:
            return JsonResponse({"success": True, "response": "pong"})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/corr/":
        try:
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            corrmat = data.corr()
            f, ax = plt.subplots(figsize=(18, 14))
            svm = sns.heatmap(corrmat, square=True, annot=True)
            figure = svm.get_figure()
            my_stringIObytes = io.BytesIO()
            figure.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True, "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/claster/factors/":
        try:
            from scipy.cluster.vq import whiten
            from sklearn.cluster import KMeans
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            norm_data = whiten(data.iloc[:, 1:])
            norm_data = pd.DataFrame(data=norm_data)
            clusters = 3
            kmeans = KMeans(n_clusters=clusters)
            kmeans.fit(norm_data)
            f, axes = plt.subplots(2, 10, figsize=(30, 10))
            sns.despine(left=True)
            cluster0 = norm_data[kmeans.labels_ == 0]
            cluster1 = norm_data[kmeans.labels_ == 1]
            cluster2 = norm_data[kmeans.labels_ == 2]
            for i in range(0, 20):
                ax = axes[i // 10, i % 10]
                a_heights, a_bins = np.histogram(cluster0.iloc[:, i + 3])
                b_heights, b_bins = np.histogram(cluster1.iloc[:, i + 3])
                c_heights, c_bins = np.histogram(cluster2.iloc[:, i + 3])
                width = (a_bins[1] - a_bins[0]) / 3
                ax.bar(a_bins[:-1], a_heights, width=width, facecolor='cornflowerblue')
                ax.bar(b_bins[:-1] + width, b_heights, width=width, facecolor='seagreen')
                ax.bar(c_bins[:-1] + 2 * width, c_heights, width=width, facecolor='red')
                ax.set_title(label="X" + str(i + 1))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True, "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/claster/y/":
        try:
            from scipy.cluster.vq import whiten
            from sklearn.cluster import KMeans
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            norm_data = whiten(data.iloc[:, 1:])
            norm_data = pd.DataFrame(data=norm_data)
            clusters = 3
            kmeans = KMeans(n_clusters=clusters)
            kmeans.fit(norm_data)
            f, axes = plt.subplots(1, 3, figsize=(30, 10))
            sns.despine(left=True)
            cluster0 = norm_data[kmeans.labels_ == 0]
            cluster1 = norm_data[kmeans.labels_ == 1]
            cluster2 = norm_data[kmeans.labels_ == 2]
            for i in range(0, 3):
                ax = axes[i]
                a_heights, a_bins = np.histogram(cluster0.iloc[:, i])
                b_heights, b_bins = np.histogram(cluster1.iloc[:, i])
                c_heights, c_bins = np.histogram(cluster2.iloc[:, i])
                width = (a_bins[1] - a_bins[0]) / 3
                ax.bar(a_bins[:-1], a_heights, width=width, facecolor='cornflowerblue')
                ax.bar(b_bins[:-1] + width, b_heights, width=width, facecolor='seagreen')
                ax.bar(c_bins[:-1] + 2 * width, c_heights, width=width, facecolor='red')
                ax.set_title(label="Y" + str(i + 1))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True, "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/all/y1/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            Y_train = y_train.iloc[:, 0]
            Y_test = y_test.iloc[:, 0]
            lr_y1 = LogisticRegression(multi_class="auto")
            lr_y1.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y1.coef_[0])[0]):
                y_string += str(round(lr_y1.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y1.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y1.predict(x_train))
            acc_test = r2_score(Y_test, lr_y1.predict(x_test))
            lr = lr_y1
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y1)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y1)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-21, 21)
            axes[1, 0].set_ylim(-21, 21)
            axes[0, 1].set_ylim(-21, 21)
            axes[1, 1].set_ylim(-21, 21)
            std = str((lr_y1.predict(x_test)-y_test.iloc[:, 0]).std() / pow(len(y_test.iloc[:, 0]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 0], lr_y1.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 0], lr_y1.predict(x_train))
            n = len(y_train.iloc[:, 0])
            m = 20
            fisher = str((R2/(1-R2))*(n-m-1)/(m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/all/y2/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            Y_train = y_train.iloc[:, 1]
            Y_test = y_test.iloc[:, 1]
            lr_y2 = LogisticRegression(multi_class="auto")
            lr_y2.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y2.coef_[0])[0]):
                y_string += str(round(lr_y2.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y2.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y2.predict(x_train))
            acc_test = r2_score(Y_test, lr_y2.predict(x_test))
            lr = lr_y2
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y2)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y2)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-4, 4)
            axes[1, 0].set_ylim(-4, 4)
            axes[0, 1].set_ylim(-4, 4)
            axes[1, 1].set_ylim(-4, 4)
            std = str((lr_y2.predict(x_test) - y_test.iloc[:, 1]).std() / pow(len(y_test.iloc[:, 1]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 1], lr_y2.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 1], lr_y2.predict(x_train))
            n = len(y_train.iloc[:, 1])
            m = 20
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/all/y3/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            Y_train = y_train.iloc[:, 2]
            Y_test = y_test.iloc[:, 2]
            lr_y3 = LogisticRegression(multi_class="auto")
            lr_y3.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y3.coef_[0])[0]):
                y_string += str(round(lr_y3.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y3.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y3.predict(x_train))
            acc_test = r2_score(Y_test, lr_y3.predict(x_test))
            lr2 = LogisticRegression(multi_class="auto")
            lr2.fit(x_train[:, [2, 3, 5, 6, 8, 13, 15, 17]], y_train.iloc[:, 2])
            acc_factors = r2_score(Y_test, lr2.predict(x_test[:, [2, 3, 5, 6, 8, 13, 15, 17]]))
            lr = lr_y3
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y3)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y3)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-40000, 150000)
            axes[1, 0].set_ylim(-40000, 150000)
            axes[0, 1].set_ylim(-40000, 150000)
            axes[1, 1].set_ylim(-40000, 150000)
            std = str((lr_y3.predict(x_test) - y_test.iloc[:, 2]).std() / pow(len(y_test.iloc[:, 2]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 2], lr_y3.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 2], lr_y3.predict(x_train))
            n = len(y_train.iloc[:, 2])
            m = 20
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "acc_factors": str(acc_factors),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/factors/y1/":
        try:
            from scipy import stats
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from sklearn.ensemble import RandomForestClassifier
            from mlxtend.feature_selection import SequentialFeatureSelector as sfs
            from sklearn.linear_model import LinearRegression
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            X = data.iloc[:, 4:25]
            Y = data.iloc[:, 1:4]
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            clf = RandomForestClassifier(n_estimators=100, n_jobs=-1)
            sfs2 = sfs(clf,
                       k_features=10,
                       forward=True,
                       floating=False,
                       verbose=2,
                       scoring='accuracy',
                       cv=None)
            sfsY1 = sfs2.fit(X, Y.iloc[:, 0])
            sfs_y1_factors = sfsY1.k_feature_idx_
            sbs2 = sfs(clf,
                       k_features=10,
                       forward=False,
                       floating=False,
                       verbose=2,
                       scoring='accuracy',
                       cv=0)
            sbsY1 = sbs2.fit(X, Y.iloc[:, 0])
            sbs_y1_factors = sbsY1.k_feature_idx_
            alpha = 0.05
            corr_y1_factors = np.zeros((20, 1), dtype=bool)
            for i in range(0, np.shape(X)[1]):
                if (stats.pearsonr(Y.iloc[:, 0], X.iloc[:, i])[1] < alpha):
                    corr_y1_factors[i] = True
                else:
                    corr_y1_factors[i] = False
            lrY1 = LogisticRegression(multi_class="auto")
            lrY1.fit(x_train[:, sfs_y1_factors], y_train.iloc[:, 0])
            sfs_y1_score_test = lrY1.score(x_test[:, sfs_y1_factors], y_test.iloc[:, 0])
            sfs_y1_score_train = lrY1.score(x_train[:, sfs_y1_factors], y_train.iloc[:, 0])
            lrY1 = LogisticRegression(multi_class="auto")
            lrY1.fit(x_train[:, sbs_y1_factors], y_train.iloc[:, 0])
            sbs_y1_score_test = lrY1.score(x_test[:, sbs_y1_factors], y_test.iloc[:, 0])
            sbs_y1_score_train = lrY1.score(x_train[:, sbs_y1_factors], y_train.iloc[:, 0])
            lrY1 = LogisticRegression(multi_class="auto")
            lrY1.fit(x_train[:, np.where(corr_y1_factors)[0]], y_train.iloc[:, 0])
            corr_y1_score_test = lrY1.score(x_test[:, np.where(corr_y1_factors)[0]], y_test.iloc[:, 0])
            corr_y1_score_train = lrY1.score(x_train[:, np.where(corr_y1_factors)[0]], y_train.iloc[:, 0])
            df = pd.DataFrame({'Column-indexes': [sfs_y1_factors, sbs_y1_factors, np.where(corr_y1_factors)[0]],
                          'Training-accuracy': [sfs_y1_score_train, sbs_y1_score_train, corr_y1_score_train],
                          'Test-accuracy': [sfs_y1_score_test, sbs_y1_score_test, corr_y1_score_test]},
                         index=['SFS', 'SBS', 'Correlation-analysis'])
            df_json = json.loads(df.to_json(orient="records"))
            return JsonResponse({"success": True, "data": df_json})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/factors/y2/":
        try:
            from scipy import stats
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from sklearn.ensemble import RandomForestClassifier
            from mlxtend.feature_selection import SequentialFeatureSelector as sfs
            from sklearn.linear_model import LinearRegression
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            X = data.iloc[:, 4:25]
            Y = data.iloc[:, 1:4]
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            clf = RandomForestClassifier(n_estimators=100, n_jobs=-1)
            sfs2 = sfs(clf,
                       k_features=10,
                       forward=True,
                       floating=False,
                       verbose=2,
                       scoring='accuracy',
                       cv=None)
            sfsY2 = sfs2.fit(X, Y.iloc[:, 1])
            sfs_y2_factors = sfsY2.k_feature_idx_
            sbs2 = sfs(clf,
                       k_features=10,
                       forward=False,
                       floating=False,
                       verbose=2,
                       scoring='accuracy',
                       cv=0)
            sbsY2 = sbs2.fit(X, Y.iloc[:, 1])
            sbs_y2_factors = sbsY2.k_feature_idx_
            alpha = 0.05
            corr_y2_factors = np.zeros((20, 1), dtype=bool)
            for i in range(0, np.shape(X)[1]):
                if (stats.pearsonr(Y.iloc[:, 1], X.iloc[:, i])[1] < alpha):
                    corr_y2_factors[i] = True
                else:
                    corr_y2_factors[i] = False
            lrY2 = LogisticRegression(multi_class="auto")
            lrY2.fit(x_train[:, sfs_y2_factors], y_train.iloc[:, 1])
            sfs_y2_score_test = lrY2.score(x_test[:, sfs_y2_factors], y_test.iloc[:, 1])
            sfs_y2_score_train = lrY2.score(x_train[:, sfs_y2_factors], y_train.iloc[:, 1])
            lrY2 = LogisticRegression(multi_class="auto")
            lrY2.fit(x_train[:, sbs_y2_factors], y_train.iloc[:, 1])
            sbs_y2_score_test = lrY2.score(x_test[:, sbs_y2_factors], y_test.iloc[:, 1])
            sbs_y2_score_train = lrY2.score(x_train[:, sbs_y2_factors], y_train.iloc[:, 1])
            lrY2 = LogisticRegression(multi_class="auto")
            lrY2.fit(x_train[:, np.where(corr_y2_factors)[0]], y_train.iloc[:, 1])
            corr_y2_score_test = lrY2.score(x_test[:, np.where(corr_y2_factors)[0]], y_test.iloc[:, 1])
            corr_y2_score_train = lrY2.score(x_train[:, np.where(corr_y2_factors)[0]], y_train.iloc[:, 1])
            df = pd.DataFrame({'Column-indexes': [sfs_y2_factors, sbs_y2_factors, np.where(corr_y2_factors)[0]],
                          'Training-accuracy': [sfs_y2_score_train, sbs_y2_score_train, corr_y2_score_train],
                          'Test-accuracy': [sfs_y2_score_test, sbs_y2_score_test, corr_y2_score_test]},
                         index=['SFS', 'SBS', 'Correlation-analysis'])
            df_json = json.loads(df.to_json(orient="records"))
            return JsonResponse({"success": True, "data": df_json})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/factors/y3/":
        try:
            from scipy import stats
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from sklearn.ensemble import RandomForestClassifier
            from mlxtend.feature_selection import SequentialFeatureSelector as sfs
            from sklearn.linear_model import LinearRegression
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            X = data.iloc[:, 4:25]
            Y = data.iloc[:, 1:4]
            y = data.iloc[:, 1:4]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=0)
            clf = RandomForestClassifier(n_estimators=100, n_jobs=-1)
            sfs1 = sfs(LinearRegression(),
                       k_features=10,
                       forward=True,
                       floating=False,
                       verbose=2,
                       scoring='neg_mean_squared_error',
                       cv=None)
            sfsY3 = sfs1.fit(X, Y.iloc[:, 2])
            sfs_y3_factors = sfsY3.k_feature_idx_
            sbs1 = sfs(LinearRegression(),
                       k_features=10,
                       forward=False,
                       floating=False,
                       verbose=2,
                       scoring='neg_mean_squared_error',
                       cv=0)
            sbsY3 = sbs1.fit(X, Y.iloc[:, 2])
            sbs_y3_factors = sbsY3.k_feature_idx_
            alpha = 0.05
            corr_y3_factors = np.zeros((20, 1), dtype=bool)
            for i in range(0, np.shape(X)[1]):
                if (stats.pearsonr(Y.iloc[:, 2], X.iloc[:, i])[1] < alpha):
                    corr_y3_factors[i] = True
                else:
                    corr_y3_factors[i] = False
            lrY3 = LogisticRegression(multi_class="auto")
            lrY3.fit(x_train[:, sfs_y3_factors], y_train.iloc[:, 2])
            sfs_y3_score_test = r2_score(y_test.iloc[:, 2], lrY3.predict(x_test[:, sfs_y3_factors]))
            sfs_y3_score_train = r2_score(y_train.iloc[:, 2], lrY3.predict(x_train[:, sfs_y3_factors]))
            lrY3 = LogisticRegression(multi_class="auto")
            lrY3.fit(x_train[:, sbs_y3_factors], y_train.iloc[:, 2])
            sbs_y3_score_test = r2_score(y_test.iloc[:, 2], lrY3.predict(x_test[:, sbs_y3_factors]))
            sbs_y3_score_train = r2_score(y_train.iloc[:, 2], lrY3.predict(x_train[:, sbs_y3_factors]))
            lrY3 = LogisticRegression(multi_class="auto")
            lrY3.fit(x_train[:, np.where(corr_y3_factors)[0]], y_train.iloc[:, 2])
            corr_y3_score_test = r2_score(y_test.iloc[:, 2], lrY3.predict(x_test[:, np.where(corr_y3_factors)[0]]))
            corr_y3_score_train = r2_score(y_train.iloc[:, 2], lrY3.predict(x_train[:, np.where(corr_y3_factors)[0]]))
            df = pd.DataFrame({'Column-indexes': [sfs_y3_factors, sbs_y3_factors, np.where(corr_y3_factors)[0]],
                          'Training-accuracy': [sfs_y3_score_train, sbs_y3_score_train, corr_y3_score_train],
                          'Test-accuracy': [sfs_y3_score_test, sbs_y3_score_test, corr_y3_score_test]},
                         index=['SFS', 'SBS', 'Correlation-analysis'])
            df_json = json.loads(df.to_json(orient="records"))
            return JsonResponse({"success": True, "data": df_json})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/cl2/y1/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from scipy.cluster.vq import whiten
            from sklearn.cluster import KMeans
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            norm_data = whiten(data.iloc[:, 1:])
            norm_data = pd.DataFrame(data=norm_data)
            clusters = 3
            kmeans = KMeans(n_clusters=clusters)
            kmeans.fit(norm_data)
            yCL2 = data[kmeans.labels_ == 1].iloc[:, 1:4]
            xCL2 = data[kmeans.labels_ == 1].iloc[:, 4:]
            xCL2 = StandardScaler().fit_transform(xCL2)
            xCL2_train, xCL2_test, yCL2_train, yCL2_test = train_test_split(xCL2, yCL2, test_size=0.3, random_state=0)
            x_train = xCL2_train
            y_train = yCL2_train
            x_test = xCL2_test
            y_test = yCL2_test
            Y_train = y_train.iloc[:, 0]
            Y_test = y_test.iloc[:, 0]
            lr_y1 = LogisticRegression(multi_class="auto")
            lr_y1.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y1.coef_[0])[0]):
                y_string += str(round(lr_y1.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y1.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y1.predict(x_train))
            acc_test = r2_score(Y_test, lr_y1.predict(x_test))
            lr = lr_y1
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y1)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y1)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-21, 21)
            axes[1, 0].set_ylim(-21, 21)
            axes[0, 1].set_ylim(-21, 21)
            axes[1, 1].set_ylim(-21, 21)
            std = str((lr_y1.predict(x_test) - y_test.iloc[:, 0]).std() / pow(len(y_test.iloc[:, 0]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 0], lr_y1.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 0], lr_y1.predict(x_train))
            n = len(y_train.iloc[:, 0])
            m = 20
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/cl2/y2/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from scipy.cluster.vq import whiten
            from sklearn.cluster import KMeans
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            norm_data = whiten(data.iloc[:, 1:])
            norm_data = pd.DataFrame(data=norm_data)
            clusters = 3
            kmeans = KMeans(n_clusters=clusters)
            kmeans.fit(norm_data)
            yCL2 = data[kmeans.labels_ == 1].iloc[:, 1:4]
            xCL2 = data[kmeans.labels_ == 1].iloc[:, 4:]
            xCL2 = StandardScaler().fit_transform(xCL2)
            xCL2_train, xCL2_test, yCL2_train, yCL2_test = train_test_split(xCL2, yCL2, test_size=0.3, random_state=0)
            x_train = xCL2_train
            y_train = yCL2_train
            x_test = xCL2_test
            y_test = yCL2_test
            Y_train = y_train.iloc[:, 1]
            Y_test = y_test.iloc[:, 1]
            lr_y2 = LogisticRegression(multi_class="auto")
            lr_y2.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y2.coef_[0])[0]):
                y_string += str(round(lr_y2.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y2.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y2.predict(x_train))
            acc_test = r2_score(Y_test, lr_y2.predict(x_test))
            lr = lr_y2
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y2)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y2)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-4, 4)
            axes[1, 0].set_ylim(-4, 4)
            axes[0, 1].set_ylim(-4, 4)
            axes[1, 1].set_ylim(-4, 4)
            std = str((lr_y2.predict(x_test) - y_test.iloc[:, 1]).std() / pow(len(y_test.iloc[:, 1]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 1], lr_y2.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 1], lr_y2.predict(x_train))
            n = len(y_train.iloc[:, 1])
            m = 20
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/linear/cl2/y3/":
        try:
            from sklearn.preprocessing import StandardScaler
            from sklearn.model_selection import train_test_split
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import r2_score
            from scipy.cluster.vq import whiten
            from sklearn.cluster import KMeans
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            norm_data = whiten(data.iloc[:, 1:])
            norm_data = pd.DataFrame(data=norm_data)
            clusters = 3
            kmeans = KMeans(n_clusters=clusters)
            kmeans.fit(norm_data)
            yCL2 = data[kmeans.labels_ == 1].iloc[:, 1:4]
            xCL2 = data[kmeans.labels_ == 1].iloc[:, 4:]
            xCL2 = StandardScaler().fit_transform(xCL2)
            xCL2_train, xCL2_test, yCL2_train, yCL2_test = train_test_split(xCL2, yCL2, test_size=0.3, random_state=0)
            x_train = xCL2_train
            y_train = yCL2_train
            x_test = xCL2_test
            y_test = yCL2_test
            Y_train = y_train.iloc[:, 2]
            Y_test = y_test.iloc[:, 2]
            lr_y3 = LogisticRegression(multi_class="auto")
            lr_y3.fit(x_train, Y_train)
            y_string = "y = 0"
            for i in range(np.shape(lr_y3.coef_[0])[0]):
                y_string += str(round(lr_y3.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(lr_y3.intercept_[0], 4))
            acc_train = r2_score(Y_train, lr_y3.predict(x_train))
            acc_test = r2_score(Y_test, lr_y3.predict(x_test))
            lr2 = LogisticRegression(multi_class="auto")
            lr2.fit(x_train[:, [2, 3, 5, 6, 8, 13, 15, 17]], y_train.iloc[:, 2])
            acc_factors = r2_score(Y_test, lr2.predict(x_test[:, [2, 3, 5, 6, 8, 13, 15, 17]]))
            lr = lr_y3
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y3)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y3)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-40000, 150000)
            axes[1, 0].set_ylim(-40000, 150000)
            axes[0, 1].set_ylim(-40000, 150000)
            axes[1, 1].set_ylim(-40000, 150000)
            std = str((lr_y3.predict(x_test) - y_test.iloc[:, 2]).std() / pow(len(y_test.iloc[:, 2]), 0.5))
            det_coff = str(r2_score(y_test.iloc[:, 2], lr_y3.predict(x_test)))
            R2 = r2_score(y_train.iloc[:, 2], lr_y3.predict(x_train))
            n = len(y_train.iloc[:, 2])
            m = 20
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(acc_train),
                                 "acc_test": str(acc_test),
                                 "acc_factors": str(acc_factors),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/genetic/y1/":
        try:
            import random
            from sklearn.preprocessing import StandardScaler
            from sklearn.datasets import load_breast_cancer
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import accuracy_score
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = np.array(data.iloc[:, 1]).reshape(-1, 1)
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.30, random_state=101)
            logmodel = LogisticRegression()
            X_train = pd.DataFrame(X_train)
            X_test = pd.DataFrame(X_test)
            chromo, score = generations(size=50, n_feat=20, n_parents=25, mutation_rate=0.10,
                                        n_gen=15, X_train=X_train, X_test=X_test, y_train=y_train, y_test=y_test,
                                        logmodel=logmodel)
            logmodel.fit(X_train.iloc[:, chromo[-1]], y_train)
            y_string = "y = 0"
            for i in range(np.shape(logmodel.coef_[0])[0]):
                y_string += str(round(logmodel.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(logmodel.intercept_[0], 4))
            gen_y1_factors = chromo[-1]
            gen_y1_score_train = logmodel.score(X_train.iloc[:, chromo[-1]], y_train)
            gen_y1_score_test = logmodel.score(X_test.iloc[:, chromo[-1]], y_test)
            lr = logmodel
            Y_train = y_train.reshape(-1, )
            Y_test = y_test.reshape(-1, )
            x_train = X_train.iloc[:, chromo[-1]]
            x_test = X_test.iloc[:, chromo[-1]]
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y1)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y1)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-21, 21)
            axes[1, 0].set_ylim(-21, 21)
            axes[0, 1].set_ylim(-21, 21)
            axes[1, 1].set_ylim(-21, 21)
            std = str((lr.predict(x_test) - y_test).std() / pow(len(y_test), 0.5))
            det_coff = str(r2_score(y_test, lr.predict(x_test)))
            R2 = r2_score(y_train, lr.predict(x_train))
            n = len(y_train)
            m = np.shape(x_train)[1]
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(gen_y1_score_train),
                                 "acc_test": str(gen_y1_score_test),
                                 "factors": np.where(gen_y1_factors)[0].tolist(),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/genetic/y2/":
        try:
            import random
            from sklearn.preprocessing import StandardScaler
            from sklearn.datasets import load_breast_cancer
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import accuracy_score
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = np.array(data.iloc[:, 2]).reshape(-1, 1)
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.30, random_state=101)
            logmodel = LogisticRegression()
            X_train = pd.DataFrame(X_train)
            X_test = pd.DataFrame(X_test)
            chromo, score = generations(size=50, n_feat=20, n_parents=25, mutation_rate=0.10,
                                           n_gen=15, X_train=X_train, X_test=X_test, y_train=y_train, y_test=y_test,
                                           logmodel=logmodel)
            logmodel.fit(X_train.iloc[:, chromo[-1]], y_train)
            y_string = "y = 0"
            for i in range(np.shape(logmodel.coef_[0])[0]):
                y_string += str(round(logmodel.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(logmodel.intercept_[0], 4))
            gen_y2_factors = chromo[-1]
            gen_y2_score_train = logmodel.score(X_train.iloc[:, chromo[-1]], y_train)
            gen_y2_score_test = logmodel.score(X_test.iloc[:, chromo[-1]], y_test)
            lr = logmodel
            Y_train = y_train.reshape(-1, )
            Y_test = y_test.reshape(-1, )
            x_train = X_train.iloc[:, chromo[-1]]
            x_test = X_test.iloc[:, chromo[-1]]
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y2)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y2)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-5, 5)
            axes[1, 0].set_ylim(-5, 5)
            axes[0, 1].set_ylim(-5, 5)
            axes[1, 1].set_ylim(-5, 5)
            std = str((lr.predict(x_test) - y_test).std() / pow(len(y_test), 0.5))
            det_coff = str(r2_score(y_test, lr.predict(x_test)))
            R2 = r2_score(y_train, lr.predict(x_train))
            n = len(y_train)
            m = np.shape(x_train)[1]
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(gen_y2_score_train),
                                 "acc_test": str(gen_y2_score_test),
                                 "factors": np.where(gen_y2_factors)[0].tolist(),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/genetic/y3/":
        try:
            import random
            from sklearn.preprocessing import StandardScaler
            from sklearn.datasets import load_breast_cancer
            from sklearn.model_selection import train_test_split
            from sklearn.linear_model import LogisticRegression
            from sklearn.metrics import accuracy_score
            from sklearn.metrics import r2_score
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            y = data.iloc[:, 3]
            x = data.iloc[:, 4:]
            x = StandardScaler().fit_transform(x)
            X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.30, random_state=101)
            logmodel = LogisticRegression()
            X_train = pd.DataFrame(X_train)
            X_test = pd.DataFrame(X_test)
            chromo, score = generations_y3(size=50, n_feat=20, n_parents=25, mutation_rate=0.10,
                                        n_gen=15, X_train=X_train, X_test=X_test, y_train=y_train, y_test=y_test, logmodel=logmodel)
            logmodel.fit(X_train.iloc[:, chromo[-1]], y_train)
            y_string = "y = 0"
            for i in range(np.shape(logmodel.coef_[0])[0]):
                y_string += str(round(logmodel.coef_[0][i], 4)) + "*x" + str(i) + " + "
            y_string += str(round(logmodel.intercept_[0], 4))
            gen_y3_score_train = r2_score(y_train, logmodel.predict(X_train.iloc[:, chromo[-1]]))
            gen_y3_score_test = r2_score(y_test, logmodel.predict(X_test.iloc[:, chromo[-1]]))
            gen_y3_factors = chromo[-1]
            lr = logmodel
            Y_train = y_train
            Y_test = y_test
            x_train = X_train.iloc[:, chromo[-1]]
            x_test = X_test.iloc[:, chromo[-1]]
            f, axes = plt.subplots(2, 2, figsize=(20, 10))
            axes[0, 0].scatter(range(len(lr.predict(x_train))), lr.predict(x_train), color='red')
            axes[0, 0].scatter(range(len(lr.predict(x_train))), Y_train)
            axes[0, 0].set_title('Train set(Y3)', fontsize=20)
            axes[0, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].scatter(range(len(Y_train)), lr.predict(x_train) - Y_train, color='red')
            axes[1, 0].set_ylabel('Y', fontsize=20)
            axes[1, 0].set_xlabel('num', fontsize=20)
            axes[0, 1].scatter(range(len(lr.predict(x_test))), lr.predict(x_test), color='red')
            axes[0, 1].scatter(range(len(lr.predict(x_test))), Y_test)
            axes[0, 1].set_title('Test set(Y3)', fontsize=20)
            axes[0, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].scatter(range(len(Y_test)), lr.predict(x_test) - Y_test, color='red')
            axes[1, 1].set_ylabel('Y', fontsize=20)
            axes[1, 1].set_xlabel('num', fontsize=20)
            axes[0, 0].set_ylim(-40000, 150000)
            axes[1, 0].set_ylim(-40000, 150000)
            axes[0, 1].set_ylim(-40000, 150000)
            axes[1, 1].set_ylim(-40000, 150000)
            std = str((lr.predict(x_test)-y_test).std() / pow(len(y_test), 0.5))
            det_coff = str(r2_score(y_test, lr.predict(x_test)))
            R2 = r2_score(y_train, lr.predict(x_train))
            n = len(y_train)
            m = np.shape(x_train)[1]
            fisher = str((R2 / (1 - R2)) * (n - m - 1) / (m))
            my_stringIObytes = io.BytesIO()
            plt.savefig(my_stringIObytes, format='png')
            my_stringIObytes.seek(0)
            my_base64_jpgData = base64.b64encode(my_stringIObytes.read()).decode('ascii')
            return JsonResponse({"success": True,
                                 "y_string": y_string,
                                 "acc_train": str(gen_y3_score_train),
                                 "acc_test": str(gen_y3_score_test),
                                 "factors": np.where(gen_y3_factors)[0].tolist(),
                                 "std": std,
                                 "det_coff": det_coff,
                                 "fisher": fisher,
                                 "data": my_base64_jpgData})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    if request.path == "/api/map/":
        try:
            import random
            data = pd.read_csv('./Data/data_set_400.csv')
            data = data.sample(frac=1)
            data1 = data.replace(',', '.', regex=True)
            data.iloc[:, 8:12] = data1.iloc[:, 8:12].astype(float)
            data.iloc[:, 14:16] = data1.iloc[:, 14:16].astype(float)
            data.iloc[:, 18:24] = data1.iloc[:, 18:24].astype(float)
            df_json = json.loads(data.to_json(orient="records"))
            for el in df_json:
                el["lat"] = random.uniform(54.855783, 55.787899)
                el["lng"] = random.uniform(49.123753, 53.076838)
            return JsonResponse({"success": True, "data": df_json})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e) + "\nTraceback:\n" + str(traceback.format_exc())})
    else:
        return JsonResponse({"success": False, "error": "Wrong api method"})
